using MailingSystem.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MailingSystem.Entities
{
    public class Template: IMailTemplate
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TemplateId { get; set; }

        [Required]
        public string OwnerEmail { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public MailingSystem.Interfaces.TemplateType Type { get; set; }

        public string Topic { get; set; }

        public string Content { get; set; }

        [Required]
        public DateTime CreationDate { get; set; }

        public Template() { }

        public Template(string ownerEmail, string name, MailingSystem.Interfaces.TemplateType type, 
            string topic, string content, DateTime creationDate) 
        {
            OwnerEmail = ownerEmail;
            Name = name;
            Type = type;
            Topic = topic;
            Content = content;
            CreationDate = creationDate;
        }
    }
}
