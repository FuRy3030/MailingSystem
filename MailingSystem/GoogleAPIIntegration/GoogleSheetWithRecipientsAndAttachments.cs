using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Mime;
using System.Text;

namespace MailingSystem.GoogleAPIIntegration
{
    public class GoogleSheetForAttachments : GoogleSheet
    {
        private readonly IHttpClientFactory ClientFactory;
        public List<string> Recipients { get; set; }
        public string AttachmentName { get; set; }

        public GoogleSheetForAttachments(IHttpClientFactory clientFactory, string Name, string CurrentSheetId, 
            List<string> recipients, string attachment) : base(Name, CurrentSheetId)
        {
            SheetId = CurrentSheetId;
            SheetName = Name;
            Recipients = recipients;
            AttachmentName = attachment;
            ClientFactory = clientFactory;
        }

        public override async void FillSheet()
        {
            await ClearSheet();
            SheetsService CurrentService = GoogleSheet.AuthenticateSheetAccess();
            IList<IList<Object>> Records = GetSheetRows(this.Recipients, this.AttachmentName);
            ApplyChangesToSheetAsync(Records, "A:A", CurrentService);
        }

        public async Task<string> GetSheetCodeForCampaign(string UserEmail)
        {
            int WorksheetId = await GetWorksheetId(this.SheetId, UserEmail);
            return await GenerateMailAdressesListFromWorkSheet(this.SheetId, WorksheetId, UserEmail);
        }

        private static IList<IList<Object>> GetSheetRows(List<string> Recipients, string Attachment)
        {
            List<IList<Object>> Records = new List<IList<Object>>();
            int MaxRows = Recipients.Count;

            IList<Object> HeaderRow = new List<Object>();
            HeaderRow.Add("Email");
            HeaderRow.Add("Attachment");
            Records.Add(HeaderRow);

            for (int i = 0; i < MaxRows; i++)
            {
                IList<Object> Row = new List<Object>();
                Row.Add(Recipients[i]);
                Row.Add(Attachment);
                Records.Add(Row);
            }

            return Records;
        }

        private async Task<int> GetWorksheetId(string SheetId, string UserEmail)
        {
            using (var Config = new ConfigurationDbContext())
            {
                MailsUserSettings? UserMailConfig = Config.MailsSettings
                    .Where(Config => Config.Email == UserEmail)
                    .FirstOrDefault();

                if (UserMailConfig != null)
                {
                    throw new Exception("No Config");
                }

                var GetWorksheetIdRequest = new HttpRequestMessage(HttpMethod.Get,
                    $"https://api.gmass.co/api/sheets/{SheetId}/worksheets?apikey={UserMailConfig.GMassAPIKey}");
                GetWorksheetIdRequest.Headers.Add("User-Agent", "MailySpace");

                var CurrentClient = ClientFactory.CreateClient();
                var Response = await CurrentClient.SendAsync(GetWorksheetIdRequest);

                var StringResponse = await Response.Content.ReadAsStringAsync();
                var ParsedResponse = JArray.Parse(StringResponse);

                if (ParsedResponse != null && ParsedResponse.Count > 0)
                {
                    return Int32.Parse(ParsedResponse[0]["worksheetId"].ToString());
                }
                else
                {
                    throw new Exception("Null response");
                }
            }
        }

        private async Task<string> GenerateMailAdressesListFromWorkSheet(string SheetId, int WorksheetId, string UserEmail)
        {
            using (var Config = new ConfigurationDbContext())
            {
                MailsUserSettings? UserMailConfig = Config.MailsSettings
                    .Where(Config => Config.Email == UserEmail)
                    .FirstOrDefault();

                if (UserMailConfig != null)
                {
                    throw new Exception("No Config");
                }

                var GetListOfAdresses = new HttpRequestMessage(HttpMethod.Post,
                    $"https://api.gmass.co/api/lists?apikey={UserMailConfig.GMassAPIKey}");
                GetListOfAdresses.Headers.Add("User-Agent", "MailySpace");

                var ContentBody = new
                {
                    listAddress = "",
                    listSource = new
                    {
                        listSourceSheet = new
                        {
                            spreadsheetId = SheetId,
                            WorksheetId = WorksheetId,
                            KeepDuplicates = true,
                            FilterCriteria = "",
                            AndOr = ""
                        }
                    }
                };
                string JSONContentBody = JsonConvert.SerializeObject(ContentBody);

                GetListOfAdresses.Content = new StringContent(
                    JSONContentBody,
                    Encoding.UTF8,
                    MediaTypeNames.Application.Json
                );

                var CurrentClient = ClientFactory.CreateClient();
                var Response = await CurrentClient.SendAsync(GetListOfAdresses);

                var StringResponse = await Response.Content.ReadAsStringAsync();
                var ParsedResponse = JObject.Parse(StringResponse);

                if (ParsedResponse != null)
                {
                    return ParsedResponse["listAddress"].ToString();
                }
                else
                {
                    throw new Exception("Null response");
                }
            }
        }
    }
}
