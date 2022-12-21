using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Globalization;
using System.Runtime.InteropServices;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MailingSystem.ScrapingServices
{
    public class NGOEntity : ScrapingSourceEntity
    {
        public NGOEntity(string name, IHttpClientFactory clientFactory) : 
            base(name, clientFactory) 
        {
            Name = name;
            ClientFactory = clientFactory;
        }

        public override async Task<List<string>> GetURLsWithOffers()
        {
            List<string> URLs = new List<string>();
            HttpClient CurrentClient = ClientFactory.CreateClient();

            foreach (string URL in this.URLsWithOfferLists)
            {
                Random RandomService = new Random();
                int RandomHeaderIndex = RandomService.Next(0, 17);

                CurrentClient.DefaultRequestHeaders.Add("User-Agent", 
                    NGOEntity.UserAgentList[RandomHeaderIndex]);
                string WebsiteHTMLDoc = await CurrentClient.GetStringAsync(URL);

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
            }

            this.SingleOfferURLs = URLs;
            return URLs;
        }

        public override async Task<List<string>> ScrapeEmailsFromOffers()
        {
            List<string> Emails = new List<string>();
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

                foreach (string EncryptedEmail in EncryptedEmails)
                {
                    List<int> IndexesInEncryptedEmail = new List<int>();
                    for (int i = EncryptedEmail.IndexOf('\''); i > -1; i = EncryptedEmail.IndexOf('\'', i + 1))
                    {
                        IndexesInEncryptedEmail.Add(i);
                    }

                    string EncryptionKey = EncryptedEmail.Substring(IndexesInEncryptedEmail[0] + 1,
                        IndexesInEncryptedEmail[1] - IndexesInEncryptedEmail[0] - 1);
                    string EncryptedEmailCode = EncryptedEmail.Substring(IndexesInEncryptedEmail[2] + 1,
                        IndexesInEncryptedEmail[3] - IndexesInEncryptedEmail[2] - 1);

                    string Email = StringDecode(EncryptionKey, EncryptedEmailCode);

                    Emails.Add(Email);
                }
                CurrentClient.DefaultRequestHeaders.Remove("User-Agent");
            }

            return Emails;
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
