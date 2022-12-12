using MailingSystem.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace MailingSystem.Models
{
    public class TemplateModel: IMailDraft
    {
        public string Token { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public TemplateType Type { get; set; }
        public string Topic { get; set; }
        public string Content { get; set; }
    }

    public class TemplateModelWithId : IMailDraft
    {
        public string Token { get; set; }

        [Required]
        public int TemplateId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public TemplateType Type { get; set; }
        public string Topic { get; set; }
        public string Content { get; set; }
    }
}
