using MailingSystem.Classes;
using MailingSystem.Interfaces;
using System.Text.Json.Serialization;

namespace MailingSystem.Models
{
    public class RecentEmail : IRecentEmail
    {
        public int id { get; set; }
        public int MailId { get; set; }
        public string MailAddress { get; set; }  
        public string OrganizationName { get; set; }
        public string UserWhoAdded { get; set; }
        public string UserVerificatiorName { get; set; }
        public int NumberOfEmailsSent { get; set; }
        public DateTime DateOfLastEmailSent { get; set; }
    }

    public class RecentEmailModel
    {
        public string AccessToken { get; set; }
        public RecentEmail RecentEmail { get; set; }
    }
}
