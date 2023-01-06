using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Entities.BackupEntities;
using MailingSystem.UserActivityService.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MailingSystem.UserActivityService
{
    public class CampaignActivityFactory : IActivityServiceFactory
    {
        public async void CreateActivityLog(int EntityId, string PictureURL, string RealName,
            OperationType ActivityType)
        {
            using (var Context = new MailsDbContext())
            using (var ActivityLogContext = new ActivityLogDbContext())
            {
                SentMailCampaign? FoundCampaign = Context.SentMailCampaigns
                    .Include(Campaign => Campaign.OrganizationMails)
                    .Where(Campaign => Campaign.CampaignId == EntityId)
                    .FirstOrDefault();

                if (FoundCampaign != null)
                {
                    CampaignActivityLog NewLog = new CampaignActivityLog(
                        PictureURL, 
                        RealName,
                        FoundCampaign.CampaignName, 
                        ActivityType, 
                        DateTime.UtcNow,
                        FoundCampaign.NumberOfFollowUps,
                        TransformListOfMailsToString(FoundCampaign.OrganizationMails)
                    );

                    await ActivityLogContext.AddAsync(NewLog);
                    await ActivityLogContext.SaveChangesAsync();
                }
            }
        }

        public string TransformListOfMailsToString(List<OrganizationMail> Mails)
        {
            string Result = String.Empty;

            foreach (OrganizationMail Mail in Mails)
            {
                Result = Result + Mail.MailAddress + ", ";
            }

            return Result.Substring(0, Result.Length - 2);
        }
    }
}
