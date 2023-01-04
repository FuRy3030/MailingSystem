using MailingSystem.Entities.BackupEntities;

namespace MailingSystem.UserActivityService
{
    public interface IActivityServiceFactory
    {
        void CreateActivityLog(int EntityId, string PictureURL, string RealName, 
            OperationType ActivityType);
    }
}
