using MailingSystem.Entities;
using MailingSystem.MailServices;
using MailingSystem.UserActivityService;
using NUnit.Framework;

namespace MailingSystem.Tests
{
    public class UserActivityTests
    {
        [TestCase("adamdu@op.pl, adam.jan.duda.krk@gmail.com, abc@firma.pl", 
            "adamdu@op.pl", "adam.jan.duda.krk@gmail.com", "abc@firma.pl")]
        public void TestIfTransformListOfMailsToString(string ExpectedEmailsString, 
            params string[] Emails)
        {
            List<OrganizationMail> ListOfOrganizationalMails = new List<OrganizationMail>();

            foreach (string Email in Emails)
            {
                OrganizationMail MailInstance = new OrganizationMail();
                MailInstance.MailAddress = Email;
                ListOfOrganizationalMails.Add(MailInstance);
            }

            CampaignActivityFactory CampaignActivityFactory = new CampaignActivityFactory();
            string EmailsString = CampaignActivityFactory
                .TransformListOfMailsToString(ListOfOrganizationalMails);

            Assert.AreEqual(ExpectedEmailsString, EmailsString);
        }
    }
}
