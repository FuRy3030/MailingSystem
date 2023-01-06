using MailingSystem.Entities.BackupEntities;

namespace MailingSystem.UserActivityService
{
    public class ActivityHistory
    {
        public List<CampaignActivityLog> CampaignLogs { get; set; }
        public List<MailActivityLog> MailLogs { get; set; }
        public List<TemplateActivityLog> TemplateLogs { get; set; }

        public ActivityHistory() 
        {
            CampaignLogs = new List<CampaignActivityLog>();
            MailLogs = new List<MailActivityLog>();
            TemplateLogs = new List<TemplateActivityLog>();
        }
    }
}
