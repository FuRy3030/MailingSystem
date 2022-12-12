using MailingSystem.Interfaces;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MailingSystem.Entities
{
    public class MailStatistics : IMailStatistics
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StatisticsId { get; set; }

        [Required]
        public bool HasOpenedCampaign { get; set; }

        public DateTime? DateOfLastOpen { get; set; }

        [Required]
        public bool HasClickedLink { get; set; }

        public DateTime? DateOfLastClick { get; set; }

        [Required]
        public bool HasReplied { get; set; }

        public DateTime? DateOfLastReply { get; set; }

        [Required]
        public int CurrentMailId { get; set; }

        [Required]
        [JsonIgnore]
        public OrganizationMail CurrentMail { get; set; }

        public MailStatistics() { }

        public MailStatistics(bool isDefaultMounted) 
        {
            HasOpenedCampaign = false;
            HasClickedLink = false;
            HasReplied = false;
            DateOfLastOpen = null;
            DateOfLastClick = null;
            DateOfLastReply = null;
        }
    }
}
