namespace MailingSystem.ScrapingServices
{
    public class ScrapedEmailEntity
    {
        public string Email { get; set; }
        public string CompanyName { get; set; }
        public bool DoesEmailExists { get; set; }

        public ScrapedEmailEntity(string email, string companyName, bool doesEmailExists) 
        { 
            Email = email;
            CompanyName = companyName;
            DoesEmailExists = doesEmailExists;
        }
    }
}
