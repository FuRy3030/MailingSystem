using MailingSystem.Entities.BackupEntities;

namespace MailingSystem.UserActivityService
{
    public class ActivityService
    {
        private IActivityServiceFactory ActivityServiceFactory { get; set; }

        public ActivityService(IActivityServiceFactory ActivityServiceFactory) 
        {
            this.ActivityServiceFactory = ActivityServiceFactory;
        }

        public void CreateActivityLog(int EntityId, string PictureURL, string RealName, 
            OperationType ActivityType)
        {
            this.ActivityServiceFactory.CreateActivityLog(EntityId, PictureURL, RealName, ActivityType);
        }
    }
}
