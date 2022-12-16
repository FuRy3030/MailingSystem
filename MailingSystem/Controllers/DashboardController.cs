using MailingSystem.Contexts;
using MailingSystem.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;

namespace MailingSystem.Controllers
{
    public class ChartData
    {
        public int Value { get; set; }
        public string DateLabel { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    public class DashboardController : ControllerBase
    {
        [Authorize]
        [HttpGet]
        [Route("getoverview")]
        public async Task<ActionResult> GetOverview([FromQuery] string Token)
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
                    {
                        Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("pl-PL");
                        List<ChartData> UserMailsByWeekData = new List<ChartData>();
                        List<ChartData> TeamMailsByWeekData = new List<ChartData>();

                        var SuggestedMails = Context.OrganizationMails
                            .Where(Mail => Mail.UserVerificatiorName == Username)
                            .OrderBy(Mail => Mail.DateOfLastEmailSent)
                            .Select(Mail => new
                            {
                                Mail.MailAddress,
                                Mail.NumberOfEmailsSent,
                                Mail.DateOfLastEmailSent
                            })
                            .ToList();

                        int UniqueUserCampaignsLastMonth = Context.SentMailCampaigns
                            .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddMonths(-1) &&
                                Campaign.SenderMailAddress == UserEmail)
                            .Count();

                        int UniqueUserOpensLastMonth = Context.OrganizationMails
                            .Include(Mail => Mail.CurrentMailStatistics)
                            .Where(Mail => Mail.UserVerificatiorName == Username &&
                                Mail.CurrentMailStatistics.DateOfLastOpen >= DateTime.UtcNow.AddMonths(-1))
                            .Count();

                        int UniqueUserClicksLastMonth = Context.OrganizationMails
                            .Include(Mail => Mail.CurrentMailStatistics)
                            .Where(Mail => Mail.UserVerificatiorName == Username &&
                                Mail.CurrentMailStatistics.DateOfLastClick >= DateTime.UtcNow.AddMonths(-1))
                            .Count();

                        int UniqueUserRepliesLastMonth = Context.OrganizationMails
                            .Include(Mail => Mail.CurrentMailStatistics)
                            .Where(Mail => Mail.UserVerificatiorName == Username &&
                                Mail.CurrentMailStatistics.DateOfLastReply >= DateTime.UtcNow.AddMonths(-1))
                            .Count();

                        for (int i = 0; i < 7 ; i++)
                        {
                            int MailsSentCount = Context.SentMailCampaigns
                                .Include(Campaign => Campaign.OrganizationMails)
                                .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddDays(-7 * (i + 1)) &&
                                    Campaign.CampaignCreationDate < DateTime.UtcNow.AddDays(-7 * (i)) &&
                                    Campaign.SenderMailAddress == UserEmail)
                                .Select(Campaign => Campaign.OrganizationMails.Count)
                                .ToList()
                                .Sum();

                            string DateLabel = $"{DateTime.UtcNow.AddDays(-7 * (i + 1)).ToShortDateString().Substring(0, 5)} - " +
                                $"{DateTime.UtcNow.AddDays(-7 * (i)).ToShortDateString().Substring(0, 5)}";

                            UserMailsByWeekData.Add(new ChartData()
                            {
                                Value = MailsSentCount,
                                DateLabel = DateLabel
                            });
                        }

                        int UniqueCampaignsLastMonth = Context.SentMailCampaigns
                            .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddMonths(-1))
                            .Count();

                        int UniqueOpensLastMonth = Context.OrganizationMails
                            .Include(Mail => Mail.CurrentMailStatistics)
                            .Where(Mail => Mail.CurrentMailStatistics.DateOfLastOpen >= DateTime.UtcNow.AddMonths(-1))
                            .Count();

                        int UniqueClicksLastMonth = Context.OrganizationMails
                            .Include(Mail => Mail.CurrentMailStatistics)
                            .Where(Mail => Mail.CurrentMailStatistics.DateOfLastClick >= DateTime.UtcNow.AddMonths(-1))
                            .Count();

                        int UniqueRepliesLastMonth = Context.OrganizationMails
                            .Include(Mail => Mail.CurrentMailStatistics)
                            .Where(Mail => Mail.CurrentMailStatistics.DateOfLastReply >= DateTime.UtcNow.AddMonths(-1))
                            .Count();

                        for (int i = 0; i < 7; i++)
                        {
                            int MailsSentCount = Context.SentMailCampaigns
                                .Include(Campaign => Campaign.OrganizationMails)
                                .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddDays(-7 * (i + 1)) &&
                                    Campaign.CampaignCreationDate < DateTime.UtcNow.AddDays(-7 * (i)))
                                .Select(Campaign => Campaign.OrganizationMails.Count)
                                .ToList()
                                .Sum();

                            string DateLabel = $"{DateTime.UtcNow.AddDays(-7 * (i + 1)).ToShortDateString().Substring(0, 5)} - " +
                                $"{DateTime.UtcNow.AddDays(-7 * (i)).ToShortDateString().Substring(0, 5)}";

                            TeamMailsByWeekData.Add(new ChartData()
                            {
                                Value = MailsSentCount,
                                DateLabel = DateLabel
                            });
                        }

                        int UserMailCount = Context.SentMailCampaigns
                            .Include(Campaign => Campaign.OrganizationMails)
                            .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddMonths(-1) &&
                                Campaign.SenderMailAddress == UserEmail)
                            .Select(Campaign => Campaign.OrganizationMails.Count)
                            .ToList()
                            .Sum();

                        int TeamMailCount = Context.SentMailCampaigns
                            .Include(Campaign => Campaign.OrganizationMails)
                            .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddMonths(-1))
                            .Select(Campaign => Campaign.OrganizationMails.Count)
                            .ToList()
                            .Sum();

                        var ResponseObject = new
                        {
                            SuggestedMails = SuggestedMails,
                            UserStatistics = new
                            {
                                UniqueUserCampaigns = UniqueUserCampaignsLastMonth,
                                UniqueUserOpens = UniqueUserOpensLastMonth,
                                UniqueUserClicks = UniqueUserClicksLastMonth,
                                UniqueUserReplies = UniqueUserRepliesLastMonth
                            },
                            UserMailsChartData = UserMailsByWeekData,
                            TeamStatistics = new
                            {
                                UniqueCampaigns = UniqueCampaignsLastMonth,
                                UniqueOpens = UniqueOpensLastMonth,
                                UniqueClicks = UniqueClicksLastMonth,
                                UniqueReplies = UniqueRepliesLastMonth
                            },
                            TeamMailsChartData = UserMailsByWeekData,
                            UserMailCount = UserMailCount,
                            TeamMailCount = TeamMailCount
                        };

                        var ResponseResult = JsonConvert.SerializeObject(ResponseObject);
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
