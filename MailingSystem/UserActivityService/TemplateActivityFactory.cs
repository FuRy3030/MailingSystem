using MailingSystem.Contexts;
using MailingSystem.Entities.BackupEntities;
using MailingSystem.Entities;
using MailingSystem.UserActivityService.Interfaces;

namespace MailingSystem.UserActivityService
{
    public class TemplateActivityFactory : IActivityServiceFactory
    {
        public async void CreateActivityLog(int EntityId, string PictureURL, string RealName,
            OperationType ActivityType)
        {
            using (var Context = new TemplatesDbContext())
            using (var ActivityLogContext = new ActivityLogDbContext())
            {
                Template? FoundTemplate = Context.Templates
                    .Where(Template => Template.TemplateId == EntityId)
                    .FirstOrDefault();

                if (FoundTemplate != null)
                {
                    TemplateActivityLog NewLog = new TemplateActivityLog(
                        PictureURL,
                        RealName,
                        FoundTemplate.Name,
                        ActivityType,
                        DateTime.UtcNow,
                        FoundTemplate.Type,
                        FoundTemplate.Topic,
                        FoundTemplate.Content
                    );

                    await ActivityLogContext.AddAsync(NewLog);
                    await ActivityLogContext.SaveChangesAsync();
                }
            }
        }
    }
}
