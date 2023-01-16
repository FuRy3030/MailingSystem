using HtmlAgilityPack;
using MailingSystem.MailServices;
using System.Diagnostics;

namespace MailingSystem.ScrapingServices
{
    public class UJEntity : ScrapingSourceEntity
    {
        public static readonly List<string> URLsWithOfferLists = new List<string>
        {
            "https://biurokarier.uj.edu.pl/student/praca?p_p_id=56_INSTANCE_hcoXKbr9B48m&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-3&p_p_col_count=2&strona=",
            "https://biurokarier.uj.edu.pl/student/praktyki?p_p_id=56_INSTANCE_mMTO3dIorFYP&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-3&p_p_col_count=3&strona="
        };

        public UJEntity(string name, IHttpClientFactory clientFactory) :
            base(name, clientFactory)
        {
            Name = name;
            ClientFactory = clientFactory;
        }

        public override async Task<List<string>> GetURLsWithOffers(MailSource Source,
            int PageNumber)
        {
            List<string> URLs = new List<string>();
            HttpClient CurrentClient = ClientFactory.CreateClient();

            Random RandomService = new Random();
            int RandomHeaderIndex = RandomService.Next(0, 17);

            CurrentClient.DefaultRequestHeaders.Add("User-Agent",
                UJEntity.UserAgentList[RandomHeaderIndex]);
            string WebsiteHTMLDoc = await CurrentClient.GetStringAsync(
                URLsWithOfferLists[(int)Source] + PageNumber.ToString());

            HtmlDocument HtmlDocument = new HtmlDocument();
            HtmlDocument.LoadHtml(WebsiteHTMLDoc);

            var OffersLinks = HtmlDocument.DocumentNode.Descendants("div")
                .Where(Node => Node.GetAttributeValue("class", "").Contains("box"))
                .Select(Node => Node.Descendants("a")
                    .Where(Node => Node.GetAttributeValue("class", "").Contains("box"))
                    .Select(Link => Link.GetAttributeValue("href", "")))
                .ToList();

            foreach (var OfferLink in OffersLinks)
            {
                if (OfferLink.FirstOrDefault() != null)
                {
                    URLs.Add(OfferLink.FirstOrDefault());
                }
            }

            CurrentClient.DefaultRequestHeaders.Remove("User-Agent");

            this.SingleOfferURLs = URLs;
            return URLs;
        }

        public override async Task<List<ScrapedEmailEntity>> ScrapeEmailsFromOffers()
        {
            List<ScrapedEmailEntity> EmailEntities = new List<ScrapedEmailEntity>();
            HttpClient CurrentClient = ClientFactory.CreateClient();

            foreach (string URL in this.SingleOfferURLs)
            {
                Random RandomService = new Random();
                int RandomHeaderIndex = RandomService.Next(0, 17);

                CurrentClient.DefaultRequestHeaders.Add("User-Agent",
                    UJEntity.UserAgentList[RandomHeaderIndex]);
                string WebsiteHTMLDoc = await CurrentClient.GetStringAsync(URL.Replace("amp;", ""));

                HtmlDocument HtmlDocument = new HtmlDocument();
                HtmlDocument.LoadHtml(WebsiteHTMLDoc);

                var Emails = HtmlDocument.DocumentNode.Descendants("div")
                    .Where(Node => Node.GetAttributeValue("class", "").Contains("col-left") &&
                        Node.InnerText.Trim() == "Firmowy adres e-mail")
                    .Select(Node => Node.NextSibling.NextSibling.InnerText.Trim())
                    .ToList();

                Debug.WriteLine(Emails.Count);

                var CompanyNames = HtmlDocument.DocumentNode.Descendants("h2")
                    .Where(Node => Node.GetAttributeValue("class", "")
                        .Contains("page-sub-heading__title"))
                    .Select(Node => Node.InnerText.Trim())
                    .ToList();

                Debug.WriteLine(CompanyNames.Count);

                for (int j = 0; j < Emails.Count; j++)
                {
                    bool IfEmailExists = MailService.CheckIfMailExists(Emails[j]);

                    EmailEntities.Add(new ScrapedEmailEntity(Emails[j], CompanyNames[j], IfEmailExists));
                }
                CurrentClient.DefaultRequestHeaders.Remove("User-Agent");
            }

            return EmailEntities;
        }
    }
}
