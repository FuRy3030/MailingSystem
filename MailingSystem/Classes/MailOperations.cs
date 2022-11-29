using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Models;

namespace MailingSystem.Classes
{
    public class MailOperations
    {
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
    }
}
