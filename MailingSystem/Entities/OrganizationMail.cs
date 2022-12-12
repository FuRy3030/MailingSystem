using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using MailingSystem.Interfaces;
using Newtonsoft.Json;

namespace MailingSystem.Entities
{
    public class OrganizationMail : IRecentEmail
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MailId { get; set; }

        [Required]
        [MinLength(1)]
        public string MailAddress { get; set; }

        public string? OrganizationName { get; set; }

        [Required]
        [MinLength(1)]
        public string UserWhoAdded { get; set;}

        [Required]
        public string UserVerificatiorName { get; set; }

        [Required]
        public int NumberOfEmailsSent { get; set; }

        [Required]
        public DateTime DateOfLastEmailSent { get; set; }

        [Required]
        [JsonIgnore]
        public MailStatistics CurrentMailStatistics { get; set; }

        [Required]
        [JsonIgnore]
        public List<SentMailCampaign> SentMailCampaigns { get; set; }

        public OrganizationMail() { }

        public OrganizationMail(string mailAddress, string? organizationName, string userWhoAdded, 
            string userVerificatiorName, int numberOfEmailsSent, DateTime dateOfLastEmailSent, MailStatistics statistics) 
        {
            MailAddress = mailAddress;
            OrganizationName = organizationName;
            UserWhoAdded = userWhoAdded;
            UserVerificatiorName = userVerificatiorName;
            NumberOfEmailsSent = numberOfEmailsSent;
            DateOfLastEmailSent = dateOfLastEmailSent;
            SentMailCampaigns = new List<SentMailCampaign>();
            CurrentMailStatistics = statistics;
        }
    }
}
