using MailingSystem.Contexts;
using Microsoft.EntityFrameworkCore;

namespace MailingSystem.StatisticsServices
{
    public interface IBasicStatisticsService
    {
        int GetMailCount();
    }

    public class BasicStatisticsServiceLastMonth : IBasicStatisticsService
    {
        private readonly MailsDbContext Context = new MailsDbContext();
        public string UserEmail { get; set; }

        public BasicStatisticsServiceLastMonth(string userEmail)
        {
            UserEmail = userEmail;
        }

        public int GetMailCount()
        {
            return Context.SentMailCampaigns
                .Include(Campaign => Campaign.OrganizationMails)
                .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddMonths(-1) &&
                    Campaign.SenderMailAddress == this.UserEmail)
                .Select(Campaign => Campaign.OrganizationMails.Count)
                .ToList()
                .Sum();
        }
    }

    public class BasicStatisticsServiceLastMonthTeam : IBasicStatisticsService
    {
        private readonly MailsDbContext Context = new MailsDbContext();

        public int GetMailCount()
        {
            return Context.SentMailCampaigns
                .Include(Campaign => Campaign.OrganizationMails)
                .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddMonths(-1))
                .Select(Campaign => Campaign.OrganizationMails.Count)
                .ToList()
                .Sum();
        }
    }
}
