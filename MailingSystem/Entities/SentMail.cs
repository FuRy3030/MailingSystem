using MailingSystem.Interfaces;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MailingSystem.Entities
{
    public class SentMailCampaign: ISentMailCampaign, IMailDraft
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LocalId { get; set; }

        [Required]
        public int CampaignId { get; set; }

        [Required]
        public string CampaignName { get; set; }

        [MaxLength(100)]
        public string? SenderMailAddress { get; set; }

        [Required]
        public string Topic { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public int NumberOfFollowUps { get; set; }

        [Required]
        public DateTime CampaignCreationDate { get; set; }

        [JsonIgnore]
        [Required]
        public List<OrganizationMail> OrganizationMails { get; set; }

        public SentMailCampaign()
        {

        }

        public SentMailCampaign(string senderMailAddress, string topic, string content, 
            int campaignId, string campaignName, int numberOfFollowUps)
        {
            Topic = topic;
            Content = content;
            OrganizationMails = new List<OrganizationMail>();
            CampaignId = campaignId;
            CampaignName = campaignName;
            SenderMailAddress = senderMailAddress;
            NumberOfFollowUps = numberOfFollowUps;
            CampaignCreationDate = DateTime.UtcNow;
        }
    }
}
