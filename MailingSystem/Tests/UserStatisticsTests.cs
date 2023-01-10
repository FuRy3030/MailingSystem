using MailingSystem.Entities;
using MailingSystem.StatisticsServices;
using NUnit.Framework;

namespace MailingSystem.Tests
{
    public class UserStatisticsTests
    {
        [TestCase(6)]
        public void TestGetMailCountForTeam(int ExpectedAmount)
        {
            BasicStatisticsServiceLastMonthTeam TestService = new BasicStatisticsServiceLastMonthTeam();

            Assert.AreEqual(ExpectedAmount, TestService.GetMailCount());
        }

        [TestCase(4, "adam.duda@szkolnagieldapracy.pl")]
        public void TestGetUniqueCampaignForUser(int ExpectedAmount, string UserEmail)
        {
            TrackingStatisticsServiceLastMonth TestService = new TrackingStatisticsServiceLastMonth(UserEmail, "");

            Assert.AreEqual(ExpectedAmount, TestService.GetUniqueCampaigns());
        }

        [TestCase(2)]
        public void TestGetUniqueOpensForTeam(int ExpectedAmount)
        {
            TrackingStatisticsServiceLastMonthTeam TestService = new TrackingStatisticsServiceLastMonthTeam();

            Assert.AreEqual(ExpectedAmount, TestService.GetUniqueOpens());
        }
    }
}
