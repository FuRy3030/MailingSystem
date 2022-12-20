using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MailingSystem.Entities
{
    public class MailsUserSettings
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        [MaxLength(50)]
        public string GMassAPIKey { get; set; }

        [Required]
        [MaxLength(55)]
        public string RecipientsSheetId { get; set; }

        public MailsUserSettings()
        {
            Email = "";
            GMassAPIKey = "";
            RecipientsSheetId = "";
        }

        public MailsUserSettings(string email, string gMassAPIKey, string sheetId)
        {
            Email = email;
            GMassAPIKey = gMassAPIKey;
            RecipientsSheetId = sheetId;
        }
    }
}
