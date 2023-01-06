using MailingSystem.Entities.BackupEntities;

namespace MailingSystem.UserActivityService.Interfaces
{
    public interface IActivityServiceFactory
    {
        void CreateActivityLog(int EntityId, string PictureURL, string RealName,
            OperationType ActivityType);
    }
}
