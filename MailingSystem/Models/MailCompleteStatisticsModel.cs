namespace MailingSystem.Models
{
    public class MailCompleteStatisticsModel
    {
        public string MailAddress { get; set; }
        public int NumberOfEmailsSent { get; set; }
        public DateTime DateOfLastEmailSent { get; set; }
        public bool HasReplied { get; set; }
        public bool HasOpenedCampaign { get; set; }
        public bool HasClickedLink { get; set; }
        public DateTime? DateOfLastClick { get; set; }
        public DateTime? DateOfLastOpen { get; set; }
        public DateTime? DateOfLastReply { get; set; }

        public MailCompleteStatisticsModel() { }

        public MailCompleteStatisticsModel(string mailAddress, int numberOfEmailsSent, 
            DateTime dateOfLastEmailSent, bool hasReplied, bool hasOpenedCampaign, bool hasClickedLink,
            DateTime? dateOfLastClick, DateTime? dateOfLastOpen, DateTime? dateOfLastReply)
        {
            MailAddress = mailAddress;
            NumberOfEmailsSent = numberOfEmailsSent;
            DateOfLastOpen = dateOfLastEmailSent;
            HasReplied = hasReplied;
            HasOpenedCampaign = hasOpenedCampaign;
            HasClickedLink = hasClickedLink;
            DateOfLastClick = dateOfLastClick;
            DateOfLastOpen = dateOfLastOpen;
            DateOfLastReply = dateOfLastReply;
        }
    }
}
