using HtmlAgilityPack;
using MailingSystem.MailServices;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Globalization;
using System.Runtime.InteropServices;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MailingSystem.ScrapingServices
{
    public class NGOEntity : ScrapingSourceEntity
    {
        public static readonly List<string> URLsWithOfferLists = new List<string>
        {
            "https://ogloszenia.ngo.pl/praca-staz/dam-prace?page=",
            "https://ogloszenia.ngo.pl/praca-staz/oferuje-staz?page=",
            "https://ogloszenia.ngo.pl/wolontariat/oferuje?page="
        };

        public NGOEntity(string name, IHttpClientFactory clientFactory) : 
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
                NGOEntity.UserAgentList[RandomHeaderIndex]);
            string WebsiteHTMLDoc = await CurrentClient.GetStringAsync(
                URLsWithOfferLists[(int)Source] + PageNumber.ToString());

            HtmlDocument HtmlDocument = new HtmlDocument();
            HtmlDocument.LoadHtml(WebsiteHTMLDoc);

            var OffersLinks = HtmlDocument.DocumentNode.Descendants("h3")
                .Where(Node => Node.GetAttributeValue("class", "").Contains("lh-title"))
                .Select(Node => Node.Descendants("a")
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
                    NGOEntity.UserAgentList[RandomHeaderIndex]);
                string WebsiteHTMLDoc = await CurrentClient.GetStringAsync(URL);

                HtmlDocument HtmlDocument = new HtmlDocument();
                HtmlDocument.LoadHtml(WebsiteHTMLDoc);

                var EncryptedEmails = HtmlDocument.DocumentNode.Descendants("div")
                    .Where(Node => Node.InnerText == "E-mail:")
                    .Select(Node => Node.NextSibling.NextSibling.GetAttributeValue("data-encrypted", ""))
                    .ToList();

                var CompanyNames = HtmlDocument.DocumentNode.Descendants("div")
                    .Where(Node => Node.InnerText == "Ogłoszeniodawca:")
                    .Select(Node => Node.NextSibling.NextSibling.InnerText.Trim())
                    .ToList();

                for (int j = 0; j < EncryptedEmails.Count; j++)
                {
                    List<int> IndexesInEncryptedEmail = new List<int>();
                    for (int i = EncryptedEmails[j].IndexOf('\''); i > -1; i = EncryptedEmails[j].IndexOf('\'', i + 1))
                    {
                        IndexesInEncryptedEmail.Add(i);
                    }

                    string EncryptionKey = EncryptedEmails[j].Substring(IndexesInEncryptedEmail[0] + 1,
                        IndexesInEncryptedEmail[1] - IndexesInEncryptedEmail[0] - 1);
                    string EncryptedEmailCode = EncryptedEmails[j].Substring(IndexesInEncryptedEmail[2] + 1,
                        IndexesInEncryptedEmail[3] - IndexesInEncryptedEmail[2] - 1);

                    string Email = StringDecode(EncryptionKey, EncryptedEmailCode);

                    bool IfEmailExists = MailService.CheckIfMailExists(Email);

                    EmailEntities.Add(new ScrapedEmailEntity(Email, CompanyNames[j], IfEmailExists));
                }
                CurrentClient.DefaultRequestHeaders.Remove("User-Agent");
            }

            return EmailEntities;
        }

        private string StringDecode(string Key, string EncryptedEmail)
        {
            int Shift = EncryptedEmail.Length;
            string UnCryptedEmail = "";
            for (int i = 0; i < EncryptedEmail.Length; i++)
            {
                if (Key.IndexOf(NGOEntity.CharAt(EncryptedEmail, i)) == -1)
                {
                    var Ltr = NGOEntity.CharAt(EncryptedEmail, i);
                    UnCryptedEmail = UnCryptedEmail + Ltr;
                }
                else
                {
                    var Ltr = (Key.IndexOf(NGOEntity.CharAt(EncryptedEmail, i)) - Shift + Key.Length) % Key.Length;
                    UnCryptedEmail = UnCryptedEmail + (NGOEntity.CharAt(Key, Ltr));
                }
            }

            return UnCryptedEmail;
        }

        private static char CharAt(string CurrentString, int Index)
        {
            try
            {
                return CurrentString[Index];
            }
            catch 
            {
                return '\0';
            }
        }
    }
}
