namespace MailingSystem.Models
{
    public class AddMailsWithCompanyModel
    {
        public List<MailWithCompany> MailsWithCompanies { get; set; }
        public string AccessToken { get; set; }
    }

    public class MailWithCompany
    {
        public string MailAddress { get; set; }
        public string CompanyName { get; set; }
    }
}
