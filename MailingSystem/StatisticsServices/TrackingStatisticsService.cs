using MailingSystem.Contexts;
using Microsoft.EntityFrameworkCore;

namespace MailingSystem.StatisticsServices
{
    public interface ITrackingStatisticsService
    {
        int GetUniqueCampaigns();
        int GetUniqueOpens();
        int GetUniqueClicks();
        int GetUniqueReplies();
    }

    public class TrackingStatisticsServiceLastMonth : ITrackingStatisticsService
    {
        private readonly MailsDbContext Context = new MailsDbContext();
        public string UserEmail { get; set; }
        public string Username { get; set; }

        public TrackingStatisticsServiceLastMonth(string userEmail, string userName)
        {
            UserEmail = userEmail;
            Username = userName;
        }

        public int GetUniqueCampaigns()
        {
            return Context.SentMailCampaigns
                .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddMonths(-1) &&
                    Campaign.SenderMailAddress == this.UserEmail)
                .Count();
        }

        public int GetUniqueOpens()
        {
            return Context.OrganizationMails
                .Include(Mail => Mail.CurrentMailStatistics)
                .Where(Mail => Mail.UserVerificatiorName == this.Username &&
                    Mail.CurrentMailStatistics.DateOfLastOpen >= DateTime.UtcNow.AddMonths(-1))
                .Count();
        }

        public int GetUniqueClicks()
        {
            return Context.OrganizationMails
                .Include(Mail => Mail.CurrentMailStatistics)
                .Where(Mail => Mail.UserVerificatiorName == this.Username &&
                    Mail.CurrentMailStatistics.DateOfLastClick >= DateTime.UtcNow.AddMonths(-1))
                .Count();
        }

        public int GetUniqueReplies()
        {
            return Context.OrganizationMails
                .Include(Mail => Mail.CurrentMailStatistics)
                .Where(Mail => Mail.UserVerificatiorName == this.Username &&
                    Mail.CurrentMailStatistics.DateOfLastReply >= DateTime.UtcNow.AddMonths(-1))
                .Count();
        }
    }

    public class TrackingStatisticsServiceLastMonthTeam : ITrackingStatisticsService
    {
        private readonly MailsDbContext Context = new MailsDbContext();

        public int GetUniqueCampaigns()
        {
            return Context.SentMailCampaigns
                .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddMonths(-1))
                .Count();
        }

        public int GetUniqueOpens()
        {
            return Context.OrganizationMails
                .Include(Mail => Mail.CurrentMailStatistics)
                .Where(Mail => Mail.CurrentMailStatistics.DateOfLastOpen >= DateTime.UtcNow.AddMonths(-1))
                .Count();
        }

        public int GetUniqueClicks()
        {
            return Context.OrganizationMails
                .Include(Mail => Mail.CurrentMailStatistics)
                .Where(Mail => Mail.CurrentMailStatistics.DateOfLastClick >= DateTime.UtcNow.AddMonths(-1))
                .Count();
        }

        public int GetUniqueReplies()
        {
            return Context.OrganizationMails
                .Include(Mail => Mail.CurrentMailStatistics)
                .Where(Mail => Mail.CurrentMailStatistics.DateOfLastReply >= DateTime.UtcNow.AddMonths(-1))
                .Count();
        }
    }
}
