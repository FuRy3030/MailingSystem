using MailingSystem.Contexts;
using MailingSystem.UserActivityService.Interfaces;

namespace MailingSystem.UserActivityService
{
    public class ActivityHistoryBuilder : IActivityHistoryBuilder
    {
        private ActivityHistory History = new ActivityHistory();
        private ActivityLogDbContext Context = new ActivityLogDbContext();

        public ActivityHistoryBuilder() 
        { 
            History = new ActivityHistory();
            Context = new ActivityLogDbContext();
        }

        public void BuildMailsHistory()
        {
            this.History.MailLogs = this.Context.MailLogs.Select(Log => Log).ToList();
        }

        public void BuildCampaignsHistory()
        {
            this.History.CampaignLogs = this.Context.CampaignLogs.Select(Log => Log).ToList();
        }

        public void BuildTemplatesHistory()
        {
            this.History.TemplateLogs = this.Context.TemplateLogs.Select(Log => Log).ToList();
        }

        public ActivityHistory GetHistory()
        {
            ActivityHistory Result = this.History;

            this.History = new ActivityHistory();

            return Result;
        }
    }
}
