using MailingSystem.Contexts;
using Microsoft.EntityFrameworkCore;

namespace MailingSystem.StatisticsServices
{
    public interface IChartDataService
    {
        List<ChartData> GetChartData();
    }

    public class ChartDataServicePastSevenWeeks : IChartDataService
    {
        private readonly MailsDbContext Context = new MailsDbContext();
        public string UserEmail { get; set; }

        public ChartDataServicePastSevenWeeks(string userEmail)
        {
            UserEmail = userEmail;
        }

        public List<ChartData> GetChartData()
        {
            List<ChartData> UserChartData = new List<ChartData>();

            for (int i = 0; i < 7; i++)
            {
                int MailsSentCount = Context.SentMailCampaigns
                    .Include(Campaign => Campaign.OrganizationMails)
                    .Where(Campaign => Campaign.CampaignCreationDate >= DateTime.UtcNow.AddDays(-7 * (i + 1)) &&
                        Campaign.CampaignCreationDate < DateTime.UtcNow.AddDays(-7 * (i)) &&
                        Campaign.SenderMailAddress == this.UserEmail)
                    .Select(Campaign => Campaign.OrganizationMails.Count)
                    .ToList()
                    .Sum();

                string DateLabel = $"{DateTime.UtcNow.AddDays(-7 * (i + 1)).ToShortDateString().Substring(0, 5)} - " +
                    $"{DateTime.UtcNow.AddDays(-7 * (i)).ToShortDateString().Substring(0, 5)}";

                UserChartData.Add(new ChartData()
                {
                    Value = MailsSentCount,
                    DateLabel = DateLabel
                });
            }

            return UserChartData;
        }
    }

    public class ChartDataServicePastSevenWeeksTeam : IChartDataService
    {
        private readonly MailsDbContext Context = new MailsDbContext();

        public List<ChartData> GetChartData()
        {
            List<ChartData> UserChartData = new List<ChartData>();

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

                UserChartData.Add(new ChartData()
                {
                    Value = MailsSentCount,
                    DateLabel = DateLabel
                });
            }

            return UserChartData;
        }
    }
}
