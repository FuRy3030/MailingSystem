using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Newtonsoft.Json;
using System.Diagnostics;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RemindersController : ControllerBase
    {
        private IHttpClientFactory ClientFactory;

        public RemindersController(IHttpClientFactory clientFactory)
        {
            ClientFactory = clientFactory;
        }

        [Authorize]
        [HttpGet]
        [Route("getmailstatistics")]
        public async Task<ActionResult> GetMailStatistics([FromQuery] string Token)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null)
                {
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;
                    var Username = DecodedToken.Claims.First(Claim => Claim.Type == "unique_name").Value;

                    using (var Context = new MailsDbContext())
                    using (var Config = new ConfigurationDbContext())
                    {
                        MailsUserSettings? UserMailConfig = Config.MailsSettings
                            .Where(Config => Config.Email == UserEmail)
                            .FirstOrDefault();

                        List<int> CampaignIds = Context.SentMailCampaigns
                            .Where(Campaign => Campaign.SenderMailAddress == UserEmail)
                            .OrderByDescending(Campaign => Campaign.CampaignCreationDate)
                            .Select(Campaign => Campaign.CampaignId)
                            .Take(10)
                            .ToList();

                        if (UserMailConfig == null)
                        {
                            return BadRequest("Config Error");
                        }

                        foreach (int CampaignId in CampaignIds)
                        {
                            var OpensTask = Task.Run(() =>
                            {
                                var CurrentClient = ClientFactory.CreateClient();
                                var Response = CurrentClient.GetStringAsync($"https://api.gmass.co/api/reports/{CampaignId}/opens?apikey={UserMailConfig.Email}");

                                var StringResponse = JObject.Parse(Response.Result);

                                if (StringResponse["data"] != null)
                                {
                                    foreach (JObject Record in StringResponse["data"])
                                    {
                                        OrganizationMail? FoundMail = Context.OrganizationMails
                                            .Include(Mail => Mail.CurrentMailStatistics)
                                            .Where(Mail => Mail.MailAddress == Record["emailAddress"].ToString()
                                                && Mail.UserVerificatiorName == Username)
                                            .FirstOrDefault();

                                        if (FoundMail != null)
                                        {
                                            FoundMail.CurrentMailStatistics.HasOpenedCampaign = true;
                                            FoundMail.CurrentMailStatistics.DateOfLastOpen =
                                                DateTime.Parse(Record["lastOpenTime"].ToString());
                                        }
                                    }
                                }
                            });

                            var ClicksTask = Task.Run(() =>
                            {
                                var CurrentClient = ClientFactory.CreateClient();
                                var Response = CurrentClient.GetStringAsync($"https://api.gmass.co/api/reports/{CampaignId}/clicks?apikey={UserMailConfig.Email}");

                                var StringResponse = JObject.Parse(Response.Result);

                                if (StringResponse["data"] != null)
                                {
                                    foreach (JObject Record in StringResponse["data"])
                                    {
                                        OrganizationMail? FoundMail = Context.OrganizationMails
                                            .Include(Mail => Mail.CurrentMailStatistics)
                                            .Where(Mail => Mail.MailAddress == Record["emailAddress"].ToString())
                                            .FirstOrDefault();

                                        if (FoundMail != null)
                                        {
                                            FoundMail.CurrentMailStatistics.HasClickedLink = true;
                                            FoundMail.CurrentMailStatistics.DateOfLastClick =
                                                DateTime.Parse(Record["clickTime"].ToString());
                                        }
                                    }
                                }
                            });

                            var RepliesTask = Task.Run(() =>
                            {
                                var CurrentClient = ClientFactory.CreateClient();
                                var Response = CurrentClient.GetStringAsync($"https://api.gmass.co/api/reports/{CampaignId}/replies?apikey={UserMailConfig.Email}");

                                var StringResponse = JObject.Parse(Response.Result);

                                if (StringResponse["data"] != null)
                                {
                                    foreach (JObject Record in StringResponse["data"])
                                    {
                                        OrganizationMail? FoundMail = Context.OrganizationMails
                                            .Include(Mail => Mail.CurrentMailStatistics)
                                            .Where(Mail => Mail.MailAddress == Record["emailAddress"].ToString())
                                            .FirstOrDefault();

                                        if (FoundMail != null)
                                        {
                                            FoundMail.CurrentMailStatistics.HasReplied = true;
                                            FoundMail.CurrentMailStatistics.DateOfLastReply =
                                                DateTime.Parse(Record["replyTime"].ToString());
                                        }
                                    }
                                }
                            });

                            await Task.WhenAll(OpensTask, ClicksTask, RepliesTask);
                        }

                        await Context.SaveChangesAsync();

                        List<MailCompleteStatisticsModel> MailsWithStatistics = Context.OrganizationMails
                            .Include(Mail => Mail.CurrentMailStatistics)
                            .Where(Mail => Mail.UserVerificatiorName == Username)
                            .Select(Mail => new MailCompleteStatisticsModel()
                            {
                                MailAddress = Mail.MailAddress,
                                NumberOfEmailsSent = Mail.NumberOfEmailsSent,
                                DateOfLastEmailSent = Mail.DateOfLastEmailSent,
                                HasReplied = Mail.CurrentMailStatistics.HasReplied,
                                HasOpenedCampaign = Mail.CurrentMailStatistics.HasOpenedCampaign,
                                HasClickedLink = Mail.CurrentMailStatistics.HasClickedLink,
                                DateOfLastClick = Mail.CurrentMailStatistics.DateOfLastClick,
                                DateOfLastOpen = Mail.CurrentMailStatistics.DateOfLastOpen,
                                DateOfLastReply = Mail.CurrentMailStatistics.DateOfLastReply
                            })
                            .ToList<MailCompleteStatisticsModel>();

                        var MailsWithStatisticsBasic = MailsWithStatistics
                            .OrderBy(Mail => Mail.DateOfLastEmailSent)
                            .Select(Mail => new
                            {
                                MailAddress = Mail.MailAddress,
                                NumberOfEmailsSent = Mail.NumberOfEmailsSent,
                                DateOfLastEmailSent = Mail.DateOfLastEmailSent,
                                HasReplied = Mail.HasReplied,
                                HasOpenedCampaign = Mail.HasOpenedCampaign,
                                HasClickedLink = Mail.HasClickedLink
                            })
                            .ToList();

                        var MailsWithStatisticsSmallActivity = MailsWithStatistics
                            .Where(Mail => Mail.HasReplied != true && Mail.HasClickedLink != true)                           
                            .OrderBy(Mail => Mail.DateOfLastEmailSent).ThenBy(Mail => Mail.DateOfLastOpen)
                            .Select(Mail => new
                            {
                                MailAddress = Mail.MailAddress,
                                NumberOfEmailsSent = Mail.NumberOfEmailsSent,
                                DateOfLastOpen = Mail.DateOfLastOpen,
                                HasOpenedCampaign = Mail.HasOpenedCampaign,
                            })
                            .ToList();

                        var MailsWithStatisticsEngaged = MailsWithStatistics
                            .Where(Mail => Mail.HasReplied == true || Mail.HasClickedLink == true)
                            .OrderBy(Mail => Mail.DateOfLastEmailSent).ThenBy(Mail => Mail.DateOfLastReply)
                            .Select(Mail => new
                            {
                                MailAddress = Mail.MailAddress,
                                NumberOfEmailsSent = Mail.NumberOfEmailsSent,
                                DateOfLastReply = Mail.DateOfLastReply,
                                HasReplied = Mail.HasReplied,
                                DateOfLastClick = Mail.DateOfLastClick,
                                HasClickedLink = Mail.HasClickedLink
                            })
                            .ToList();

                        var ResponseData = new
                        {
                            MailsWithStatisticsBasic = MailsWithStatisticsBasic,
                            MailsWithStatisticsEngaged = MailsWithStatisticsEngaged,
                            MailsWithStatisticsSmallActivity = MailsWithStatisticsSmallActivity
                        };                      

                        string ResponseResult = JsonConvert.SerializeObject(ResponseData);
                        return new ContentResult()
                        {
                            Content = ResponseResult,
                            ContentType = "application/json",
                            StatusCode = 200
                        };
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
