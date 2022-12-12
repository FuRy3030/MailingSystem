using MailingSystem.Classes;
using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Models;
using Microsoft.AspNetCore.Authorization;
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

        public SendingMailsController(IHttpClientFactory clientFactory) 
        {
            ClientFactory = clientFactory;
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
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;
                    var Username = DecodedToken.Claims.First(Claim => Claim.Type == "unique_name").Value;
                    string RecipientsString = "";

                    foreach (string Recipient in SentMailModel.Recipients)
                    {
                        RecipientsString = RecipientsString + Recipient + ", ";
                    }
                    RecipientsString = RecipientsString.Substring(0, RecipientsString.Length - 2);

                    var CreateCampaignRequest = new HttpRequestMessage(HttpMethod.Post,
                        "https://api.gmass.co/api/campaigndrafts?apikey=b1d02e85-33cf-4d4e-90e0-17a4b9efca81");
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
                        int CamaignId = await MailOperations.SendCampaign(CurrentCampaignDraft.campaignDraftId, 
                            SentMailModel.Name, SentMailModel.FollowUpsNumber, SentMailModel.FollowUps);

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
                                CamaignId, 
                                SentMailModel.Name, 
                                SentMailModel.FollowUpsNumber
                            );

                            NewCampaign.OrganizationMails = CurrentRecipientsMails;

                            await Context.SentMailCampaigns.AddAsync(NewCampaign);
                            await Context.SaveChangesAsync();

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
