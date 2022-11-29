namespace MailingSystem.Interfaces
{
    public interface IRecentEmail
    {
        public int MailId { get; set; }
        public string MailAddress { get; set; }
        public string OrganizationName { get; set; }
        public string UserWhoAdded { get; set; }
        public string UserVerificatiorName { get; set; }
        public int NumberOfEmailsSent { get; set; }
        public DateTime DateOfLastEmailSent { get; set; }
    }
}
