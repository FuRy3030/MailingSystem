using Google.Apis.Sheets.v4;

namespace MailingSystem.GoogleAPIIntegration
{
    public class GoogleSheetForAttachments : GoogleSheet
    {
        public List<string> Recipients { get; set; }
        public string AttachmentName { get; set; }

        public GoogleSheetForAttachments(string Name, string CurrentSheetId, 
            List<string> recipients, string attachment) : base(Name, CurrentSheetId)
        {
            SheetId = CurrentSheetId;
            SheetName = Name;
            Recipients = recipients;
            AttachmentName = attachment;
        }

        public override void FillSheet()
        {
            SheetsService CurrentService = GoogleSheet.AuthenticateSheetAccess();
            IList<IList<Object>> Records = GetSheetRows(this.Recipients, this.AttachmentName);
            ApplyChangesToSheetAsync(Records, "A:A", CurrentService);
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

        private async Task<int> GetWorksheetId(string SheetId)
        {
            var SendCampaignRequest = new HttpRequestMessage(HttpMethod.Post,
                $"https://api.gmass.co/api/campaigns/{CampaignId}?apikey=b1d02e85-33cf-4d4e-90e0-17a4b9efca81");
            SendCampaignRequest.Headers.Add("User-Agent", "MailySpace");
        }
    }
}
