using MailingSystem.Interfaces;

namespace MailingSystem.Models
{
    public class SentMailModel : IMailDraft
    {
        public string Token { get; set; }
        public List<string> Recipients { get; set; }
        public string Topic { get; set; }
        public string Content { get; set; }
        public string Name { get; set; }
        public int FollowUpsNumber { get; set; }
        public List<FollowUpModel> FollowUps { get; set; }
        public string AttachmentFileName { get; set; }
    }

    public class FollowUpModel
    {
        public int DaySpan { get; set; }
        public string Behavior { get; set; }
        public string Content { get; set; }
    }
}
