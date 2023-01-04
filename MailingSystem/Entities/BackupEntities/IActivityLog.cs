namespace MailingSystem.Entities.BackupEntities
{
    public enum OperationType
    {
        Add = 0,
        Edit = 1,
        Delete = 2
    }

    public interface IActivityLog
    {
        int Id { get; set; }
        string PictureURL { get; set; }
        string UserRealName { get; set; }
        string EntityName { get; set; }
        OperationType ActivityType { get; set; }
        DateTime ActivityTime { get; set; }
    }
}
