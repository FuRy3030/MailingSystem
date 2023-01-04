using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MailingSystem.Entities.BackupEntities
{
    public class MailActivityLog : IActivityLog
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string PictureURL { get; set; }

        [Required]
        public string UserRealName { get; set; }

        [Required]
        public string EntityName { get; set; }

        [Required]
        public OperationType ActivityType { get; set; }

        [Required]
        public DateTime ActivityTime { get; set; }

        public MailActivityLog () { }

        public MailActivityLog (string pictureURL, string userRealName, string entityName, 
            OperationType activityType, DateTime activityTime)
        {
            PictureURL = pictureURL;
            UserRealName = userRealName;
            EntityName = entityName;
            ActivityType = activityType;
            ActivityTime = activityTime;
        }
    }
}
