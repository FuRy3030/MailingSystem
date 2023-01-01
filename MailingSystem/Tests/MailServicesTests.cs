using MailingSystem.MailServices;
using NUnit.Framework;

namespace MailingSystem.Tests
{
    public class MailServicesTests
    {
        [TestCase(true, "adam.jan.duda.krk@gmail.com")]
        [TestCase(true, "adamdu.niepolomice@gmail.com")]
        [TestCase(false, "adamdu@op.pl")]
        public void CheckIfMailExistsInDatabaseTest(bool IfEmailExists, string EmailAdress)
        {
            bool IfExistsTestCase = MailService.CheckIfMailExists(EmailAdress);
            Assert.AreEqual(IfExistsTestCase, IfEmailExists);
        }
    }
}
