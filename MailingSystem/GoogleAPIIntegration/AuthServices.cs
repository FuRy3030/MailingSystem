using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Util.Store;
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;

namespace MailingSystem.GoogleAPIIntegration
{
    public class AuthServices
    {
        protected static SheetsService AuthenticateSheetAccess()
        {
            string[] Scopes = new string[] {
                SheetsService.Scope.Spreadsheets,
                DriveService.Scope.Drive,
                DriveService.Scope.DriveFile
            };

            GoogleCredential Credentials;

            using (var Stream = new FileStream("app-client.json", FileMode.Open, FileAccess.Read))
            {
                Credentials = GoogleCredential.FromStream(Stream)
                    .CreateScoped(Scopes);
            }

            SheetsService Service = new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = Credentials,
                ApplicationName = "MailySpace",

            });

            return Service;
        }
    }
}
