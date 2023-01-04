using MailingSystem.Contexts;
using MailingSystem.Entities.BackupEntities;
using MailingSystem.Entities;

namespace MailingSystem.UserActivityService
{
    public class MailActivityFactory : IActivityServiceFactory
    {
        public async void CreateActivityLog(int EntityId, string PictureURL, string RealName,
            OperationType ActivityType)
        {
            using (var Context = new MailsDbContext())
            using (var ActivityLogContext = new ActivityLogDbContext())
            {
                OrganizationMail? FoundMail = Context.OrganizationMails
                    .Where(Mail => Mail.MailId == EntityId)
                    .FirstOrDefault();

                if (FoundMail != null)
                {
                    MailActivityLog NewLog = new MailActivityLog(
                        PictureURL,
                        RealName,
                        FoundMail.MailAddress,
                        ActivityType,
                        DateTime.UtcNow
                    );

                    await ActivityLogContext.AddAsync(NewLog);
                    await ActivityLogContext.SaveChangesAsync();
                }
            }
        }
    }
}
