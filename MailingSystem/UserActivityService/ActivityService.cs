using MailingSystem.Entities.BackupEntities;
using MailingSystem.UserActivityService.Interfaces;

namespace MailingSystem.UserActivityService
{
    public class ActivityService
    {
        private IActivityServiceFactory? ActivityServiceFactory { get; set; }
        private IActivityHistoryBuilder? ActivityBuilder { get; set; }

        public ActivityService(IActivityServiceFactory ActivityServiceFactory) 
        {
            this.ActivityServiceFactory = ActivityServiceFactory;
        }

        public ActivityService(IActivityHistoryBuilder ActivityBuilder)
        {
            this.ActivityBuilder = ActivityBuilder;
        }

        public void CreateActivityLog(int EntityId, string PictureURL, string RealName, 
            OperationType ActivityType)
        {
            if (this.ActivityServiceFactory != null)
            {
                this.ActivityServiceFactory.CreateActivityLog(EntityId, PictureURL, RealName, ActivityType);
            }      
        }

        public void BuildActivityLogHistory()
        {
            if (this.ActivityBuilder != null)
            {
                this.ActivityBuilder.BuildMailsHistory();
                this.ActivityBuilder.BuildTemplatesHistory();
                this.ActivityBuilder.BuildCampaignsHistory();
            }
        }
    }
}
