using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Models;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Mime;
using System.Text;

namespace MailingSystem.Classes
{
    public class MailOperations
    {
        private readonly IHttpClientFactory ClientFactory;

        public MailOperations(IHttpClientFactory clientFactory)
        {
            ClientFactory = clientFactory;
        }

        public static bool CheckIfEmailExists(string EmailAdress)
        {
            using (var Context = new MailsDbContext())
            {
                OrganizationMail? CurrentMailEntity = Context.OrganizationMails
                    .Where(Mail => Mail.MailAddress == EmailAdress)
                    .FirstOrDefault();

                if (CurrentMailEntity != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public async Task<int> SendCampaign(string CampaignId, string CampaignName, int FollowUpsNumber, 
            List<FollowUpModel> FollowUps)
        {
            var SendCampaignRequest = new HttpRequestMessage(HttpMethod.Post,
                $"https://api.gmass.co/api/campaigns/{CampaignId}?apikey=b1d02e85-33cf-4d4e-90e0-17a4b9efca81");
            SendCampaignRequest.Headers.Add("User-Agent", "MailySpace");

            switch (FollowUpsNumber)
            {
                case 0:
                    var ContentBody = new
                    {
                        openTracking = true,
                        clickTracking = true,
                        skipWeekends = false,
                        friendlyName = CampaignName,
                        sendAsReply = false,
                        createDrafts = false,
                        useSMTP = false,
                        imagesMode = "d",
                    };
                    string JSONContentBody = JsonConvert.SerializeObject(ContentBody);

                    SendCampaignRequest.Content = new StringContent(
                        JSONContentBody,
                        Encoding.UTF8,
                        MediaTypeNames.Application.Json
                    );
                    break;

                case 1:
                    var ContentBodyOneFollowUp = new
                    {
                        openTracking = true,
                        clickTracking = true,
                        skipWeekends = false,
                        friendlyName = CampaignName,
                        sendAsReply = false,
                        createDrafts = false,
                        useSMTP = false,
                        imagesMode = "d",
                        stageOneDays = FollowUps[0].DaySpan,
                        stageOneCampaignText = FollowUps[0].Content,
                        stageOneAction = FollowUps[0].Behavior
                    };
                    string JSONContentBodyOneFollowUp = JsonConvert.SerializeObject(ContentBodyOneFollowUp);

                    SendCampaignRequest.Content = new StringContent(
                        JSONContentBodyOneFollowUp,
                        Encoding.UTF8,
                        MediaTypeNames.Application.Json
                    );
                    break;

                case 2:
                    var ContentBodyTwoFollowUps = new
                    {
                        openTracking = true,
                        clickTracking = true,
                        skipWeekends = false,
                        friendlyName = CampaignName,
                        sendAsReply = false,
                        createDrafts = false,
                        useSMTP = false,
                        imagesMode = "d",
                        stageOneDays = FollowUps[0].DaySpan,
                        stageOneCampaignText = FollowUps[0].Content,
                        stageOneAction = FollowUps[0].Behavior,
                        stageTwoDays = FollowUps[1].DaySpan,
                        stageTwoCampaignText = FollowUps[1].Content,
                        stageTwoAction = FollowUps[1].Behavior
                    };
                    string JSONContentBodyTwoFollowUps = JsonConvert.SerializeObject(ContentBodyTwoFollowUps);

                    SendCampaignRequest.Content = new StringContent(
                        JSONContentBodyTwoFollowUps,
                        Encoding.UTF8,
                        MediaTypeNames.Application.Json
                    );
                    break;
            }               

            var CurrentClient = ClientFactory.CreateClient();
            var Response = await CurrentClient.SendAsync(SendCampaignRequest);

            var ParsedResult = await Response.Content.ReadFromJsonAsync<CreateCampaignResultModel>();

            return (int)ParsedResult.campaignId;
        }
    }
}
