using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Google.Apis.Util.Store;
using System.Net.Security;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MailingSystem.GoogleAPIIntegration
{
    public class GoogleSheet : AuthServices
    {
        public string SheetId { get; set; }
        public string SheetName { get; set; }

        public GoogleSheet(string Name, string CurrentSheetId) 
        {
            SheetName = Name;
            SheetId = CurrentSheetId;
        }

        public virtual void FillSheet()
        {
            // To be determined
        }

        public async Task ClearSheet()
        {
            SheetsService CurrentService = GoogleSheet.AuthenticateSheetAccess();

            var ClearRequestBody = new Google.Apis.Sheets.v4.Data.ClearValuesRequest();
            SpreadsheetsResource.ValuesResource.ClearRequest Request =
                CurrentService.Spreadsheets.Values.Clear(ClearRequestBody, this.SheetId, $"A1:ZZ");

            await Request.ExecuteAsync();
        }

        protected void ApplyChangesToSheetAsync(IList<IList<System.Object>> Records, string NewRange, SheetsService Service)
        {
            SpreadsheetsResource.ValuesResource.AppendRequest Request = Service.Spreadsheets.Values.Append(
                new ValueRange() { Values = Records }, 
                this.SheetId,
                NewRange
            );

            Request.InsertDataOption = 
                SpreadsheetsResource.ValuesResource.AppendRequest.InsertDataOptionEnum.INSERTROWS;
            Request.ValueInputOption = 
                SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.RAW;
            var Response = Request.Execute();
        }
    }
}
