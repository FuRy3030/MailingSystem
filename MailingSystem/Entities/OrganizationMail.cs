using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MailingSystem.Entities
{
    public class OrganizationMail
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MailId { get; set; }

        [Required]
        public string MailAddress { get; set; }

        public string? OrganizationName { get; set; }

        [Required]
        public string UserWhoAdded { get; set;}

        [Required]
        public string UserVerificatiorName { get; set; }

        [Required]
        public int NumberOfEmailsSent { get; set; }

        [Required]
        public DateTime DateOfLastEmailSent { get; set; }

        public OrganizationMail() { }

        public OrganizationMail(string mailAddress, string? organizationName, string userWhoAdded, 
            string userVerificatiorName, int numberOfEmailsSent, DateTime dateOfLastEmailSent) 
        {
            MailAddress = mailAddress;
            OrganizationName = organizationName;
            UserWhoAdded = userWhoAdded;
            UserVerificatiorName = userVerificatiorName;
            NumberOfEmailsSent = numberOfEmailsSent;
            DateOfLastEmailSent = dateOfLastEmailSent;
        }
    }
}
