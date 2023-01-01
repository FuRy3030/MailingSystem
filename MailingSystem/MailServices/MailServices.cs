using MailingSystem.Contexts;
using MailingSystem.Entities;
using System.Net.Mail;

namespace MailingSystem.MailServices
{
    public class MailService
    {
        public static bool CheckIfMailExists(string Email)
        {
            using (var Context = new MailsDbContext())
            {
                OrganizationMail? CurrentMailEntity = Context.OrganizationMails
                    .Where(Mail => Mail.MailAddress == Email)
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
    }
}
