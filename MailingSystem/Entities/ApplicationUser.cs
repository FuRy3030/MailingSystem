using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace MailingSystem.Entities
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        public string RealName { get; set; }

        [Required]
        public string RefreshToken { get; set; }

        [Required]
        public string LastAccessToken { get; set; }

        [Required]
        public DateTime LastAccessTokenExpirationTime { get; set; }
    }
}
