using MailingSystem.Classes;
using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Entities.BackupEntities;
using MailingSystem.GoogleAPIIntegration;
using MailingSystem.Models;
using MailingSystem.UserActivityService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mime;
using System.Security.Cryptography;
using System.Text;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SendingMailsController : ControllerBase
    {
        private IHttpClientFactory ClientFactory;

        private readonly UserManager<ApplicationUser> UserManager;

        public SendingMailsController(IHttpClientFactory clientFactory, UserManager<ApplicationUser> userManager) 
        {
            ClientFactory = clientFactory;
            UserManager = userManager;
        }

        [Authorize]
        [HttpPost]
        [Route("send")]
        public async Task<ActionResult> SendMails([FromBody] SentMailModel SentMailModel)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(SentMailModel.Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && SentMailModel.Recipients.Count > 0)
                {
                    string UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;
                    string Username = DecodedToken.Claims.First(Claim => Claim.Type == "unique_name").Value;
                    string RealName = DecodedToken.Claims.First(Claim => Claim.Type == "given_name").Value;
                    var User = await UserManager.FindByEmailAsync(UserEmail);

                    if (User == null)
                    {
                        return BadRequest("User not found!");
                    }

                    using (var Config = new ConfigurationDbContext())
                    {
                        MailsUserSettings? UserMailConfig = Config.MailsSettings
                            .Where(Config => Config.Email == UserEmail)
                            .FirstOrDefault();

                        int CampaignId = -1;

                        if (UserMailConfig != null && UserMailConfig.RecipientsSheetId != "" && 
                            SentMailModel.AttachmentFileName != "")
                        {
                            GoogleSheetForAttachments NewAttachmentsSheet = new GoogleSheetForAttachments(
                                ClientFactory,
                                SentMailModel.Name + " Recipient Sheet",
                                UserMailConfig.RecipientsSheetId,
                                SentMailModel.Recipients,
                                SentMailModel.AttachmentFileName
                            );

                            NewAttachmentsSheet.FillSheet();
                            string ListAdresses = await NewAttachmentsSheet.GetSheetCodeForCampaign(UserEmail);

                            var CreateCampaignRequest = new HttpRequestMessage(HttpMethod.Post,
                                $"https://api.gmass.co/api/campaigndrafts?apikey={UserMailConfig.GMassAPIKey}");
                            CreateCampaignRequest.Headers.Add("User-Agent", "MailySpace");

                            var ContentBody = new
                            {
                                subject = SentMailModel.Topic,
                                message = SentMailModel.Content,
                                messageType = "html",
                                listAddress = ListAdresses
                            };
                            string JSONContentBody = JsonConvert.SerializeObject(ContentBody);

                            CreateCampaignRequest.Content = new StringContent(
                                JSONContentBody,
                                Encoding.UTF8,
                                MediaTypeNames.Application.Json
                            );

                            var CurrentClient = ClientFactory.CreateClient();
                            var Response = await CurrentClient.SendAsync(CreateCampaignRequest);

                            CreateCampaignDraftModel? CurrentCampaignDraft =
                                await Response.Content.ReadFromJsonAsync<CreateCampaignDraftModel>();

                            if (CurrentCampaignDraft != null &&
                                CurrentCampaignDraft.campaignDraftId != null)
                            {
                                MailOperations MailOperations = new MailOperations(ClientFactory);
                                CampaignId = await MailOperations.SendCampaign(CurrentCampaignDraft.campaignDraftId,
                                    SentMailModel.Name, SentMailModel.FollowUpsNumber, SentMailModel.FollowUps, 
                                    UserMailConfig.GMassAPIKey);
                            }
                        }
                        else if (UserMailConfig != null)
                        {
                            string RecipientsString = "";

                            foreach (string Recipient in SentMailModel.Recipients)
                            {
                                RecipientsString = RecipientsString + Recipient + ", ";
                            }
                            RecipientsString = RecipientsString.Substring(0, RecipientsString.Length - 2);

                            var CreateCampaignRequest = new HttpRequestMessage(HttpMethod.Post,
                                $"https://api.gmass.co/api/campaigndrafts?apikey={UserMailConfig.GMassAPIKey}");
                            CreateCampaignRequest.Headers.Add("User-Agent", "MailySpace");

                            var ContentBody = new
                            {
                                subject = SentMailModel.Topic,
                                message = SentMailModel.Content,
                                messageType = "html",
                                emailAddresses = RecipientsString
                            };
                            string JSONContentBody = JsonConvert.SerializeObject(ContentBody);

                            CreateCampaignRequest.Content = new StringContent(
                                JSONContentBody,
                                Encoding.UTF8,
                                MediaTypeNames.Application.Json
                            );

                            var CurrentClient = ClientFactory.CreateClient();
                            var Response = await CurrentClient.SendAsync(CreateCampaignRequest);

                            CreateCampaignDraftModel? CurrentCampaignDraft =
                                await Response.Content.ReadFromJsonAsync<CreateCampaignDraftModel>();

                            if (CurrentCampaignDraft != null &&
                                CurrentCampaignDraft.campaignDraftId != null)
                            {
                                MailOperations MailOperations = new MailOperations(ClientFactory);
                                CampaignId = await MailOperations.SendCampaign(CurrentCampaignDraft.campaignDraftId,
                                    SentMailModel.Name, SentMailModel.FollowUpsNumber, SentMailModel.FollowUps, 
                                    UserMailConfig.GMassAPIKey);
                            }
                        }
                        else
                        {
                            return BadRequest("Error");
                        }

                        using (var Context = new MailsDbContext())
                        {
                            List<OrganizationMail> CurrentRecipientsMails = new List<OrganizationMail>();

                            foreach (string MailAdress in SentMailModel.Recipients)
                            {
                                OrganizationMail? CurrentMail = Context.OrganizationMails
                                    .Where(OrgMail => OrgMail.UserVerificatiorName == Username &&
                                        OrgMail.MailAddress == MailAdress)
                                    .Select(OrgMail => OrgMail)
                                    .FirstOrDefault();

                                if (CurrentMail != null)
                                {
                                    CurrentMail.NumberOfEmailsSent = CurrentMail.NumberOfEmailsSent + 1;
                                    CurrentMail.DateOfLastEmailSent = DateTime.UtcNow;
                                    CurrentRecipientsMails.Add(CurrentMail);
                                }
                            }

                            SentMailCampaign NewCampaign = new SentMailCampaign(
                                UserEmail,
                                SentMailModel.Topic,
                                SentMailModel.Content,
                                CampaignId,
                                SentMailModel.Name,
                                SentMailModel.FollowUpsNumber
                            );

                            NewCampaign.OrganizationMails = CurrentRecipientsMails;

                            await Context.SentMailCampaigns.AddAsync(NewCampaign);
                            await Context.SaveChangesAsync();

                            CampaignActivityFactory CampaignActivityFactory = new CampaignActivityFactory();
                            ActivityService Service = new ActivityService(CampaignActivityFactory);
                            Service.CreateActivityLog(
                                NewCampaign.LocalId,
                                User.PictureURL,
                                RealName,
                                OperationType.Add
                            );

                            return new ContentResult()
                            {
                                Content = "Success",
                                ContentType = "application/json",
                                StatusCode = 200
                            };
                        }
                    }                      
                }

                return BadRequest("Error");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
