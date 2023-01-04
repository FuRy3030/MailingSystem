using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MailingSystem.Entities.BackupEntities
{
    public class TemplateActivityLog : IActivityLog
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

        [Required]
        public MailingSystem.Interfaces.TemplateType Type { get; set; }

        [Required]
        public string Topic { get; set; }

        [Required]
        public string Content { get; set; }

        public TemplateActivityLog() { }

        public TemplateActivityLog(string pictureURL, string userRealName,
            string entityName, OperationType activityType, DateTime activityTime,
            MailingSystem.Interfaces.TemplateType type, string topic, string content)
        {
            PictureURL = pictureURL;
            UserRealName = userRealName;
            EntityName = entityName;
            ActivityType = activityType;
            ActivityTime = activityTime;
            Type = type;
            Topic = topic;
            Content = content;
        }
    }
}
