namespace MailingSystem.ScrapingServices
{
    public class ScrapedEmailEntity
    {
        public string Email { get; set; }
        public string CompanyName { get; set; }

        public ScrapedEmailEntity(string email, string companyName) 
        { 
            Email = email;
            CompanyName = companyName;
        }
    }
}
