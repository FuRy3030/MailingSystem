using MailingSystem.ScrapingServices;

namespace MailingSystem.Models
{
    public class ExtractorConfigurationModel
    {
        public string ExtractorSource { get; set; }
        public int PageNumber { get; set; }
        public MailSource MailSource { get; set; }
    }
}
