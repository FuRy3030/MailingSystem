namespace MailingSystem.UserActivityService.Interfaces
{
    public interface IActivityHistoryBuilder
    {
        void BuildMailsHistory();
        void BuildCampaignsHistory();
        void BuildTemplatesHistory();
    }
}
