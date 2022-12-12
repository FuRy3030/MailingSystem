namespace MailingSystem.Interfaces
{
    public enum TemplateType
    {
        Universal,
        ForMail,
        ForResponse
    }

    public interface IRecentEmail
    {
        int MailId { get; set; }
        string MailAddress { get; set; }
        string OrganizationName { get; set; }
        string UserWhoAdded { get; set; }
        string UserVerificatiorName { get; set; }
        int NumberOfEmailsSent { get; set; }
        DateTime DateOfLastEmailSent { get; set; }
    }

    public interface IMailDraft
    {
        string Topic { get; set; }
        string Content { get; set; }
    }

    public interface IMailTemplate : IMailDraft
    {
        int TemplateId { get; set; }
        string OwnerEmail { get; set; }
        TemplateType Type { get; set; }
        string Name { get; set; }
        DateTime CreationDate { get; set; }
    }

    public interface ISentMailCampaign : IMailDraft
    {
        int LocalId { get; set; }
        int CampaignId { get; set; }
        string SenderMailAddress { get; set; }
        string CampaignName { get; set; }
    }

    public interface IMailStatistics
    {
        bool HasOpenedCampaign { get; set; }
        bool HasClickedLink { get; set; }
        bool HasReplied { get; set; }
        DateTime? DateOfLastOpen { get; set; }
        DateTime? DateOfLastClick { get; set; }
        DateTime? DateOfLastReply { get; set; }
    }
}
