namespace MailingSystem.Models
{
    public class CreateCampaignDraftModel
    {
        public string? campaignDraftId { get; set; }
        public string? fromEmail { get; set; }
        public string? subject { get; set; }
        public string? message { get; set; }
        public string? messageType { get; set; }
        public string? listAddress { get; set; }
        public string? emailAddresses { get; set; }
        public string? cc { get; set; }
        public string? bcc { get; set; }
    }

    public class CreateCampaignResultModel
    {
        public int? campaignId { get; set; }
        public string? subject { get; set; }
        public object? statistics { get; set; }
    }

    public class OpenResponseEntity
    {
        public string emailAddress { get; set; }
        public int openCount { get; set; }
        public DateTime lastOpenTime { get; set; }
    }
}
