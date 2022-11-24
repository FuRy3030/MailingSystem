using MailingSystem.Classes;
using MailingSystem.Entities;
using MailingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TokenController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;

        public TokenController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("refreshtoken")]
        public async Task<IActionResult> RefreshAccessToken([FromBody] VerificationTokens Tokens)
        {
            if (Tokens.AccessToken is null)
            {
                return BadRequest("Invalid client request");
            }
            Debug.WriteLine(Tokens.RefreshToken);
            Debug.WriteLine(Tokens.AccessToken);

            var Principal = GetPrincipalFromExpiredToken(Tokens.AccessToken);
            Debug.WriteLine('a');
            if (Principal == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            string? Username = Principal.Identity.Name;
            Debug.WriteLine(Username);
            var CurrentUser = await UserManager.FindByNameAsync(Username);

            string? CurrentRefreshToken = CurrentUser.RefreshToken;
            string? LastAccessToken = CurrentUser.LastAccessToken;

            if (CurrentUser == null || LastAccessToken != Tokens.AccessToken || 
                CurrentRefreshToken != Tokens.RefreshToken ||
                CurrentUser.LastAccessTokenExpirationTime > DateTime.UtcNow)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            var NewAccessToken = AuthManagement.GenerateJWTToken(CurrentUser.UserName, CurrentUser.Email, CurrentUser.RealName);

            DateTime NewExpirationTime = DateTime.UtcNow.AddHours(1);
            CurrentUser.LastAccessTokenExpirationTime = NewExpirationTime;
            CurrentUser.LastAccessToken = NewAccessToken;
            await UserManager.UpdateAsync(CurrentUser);

            return new ObjectResult(new
            {
                AccessToken = NewAccessToken,
                ExpirationTime = NewExpirationTime
            });
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? Token)
        {
            IConfigurationRoot Configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(Configuration["JWT:Key"])),
                ValidateLifetime = false,
                ValidIssuer = Configuration["JWT:Issuer"],
                ValidAudience = Configuration["JWT:Audience"]
            };

            var TokenHandler = new JwtSecurityTokenHandler();
            if (TokenHandler.CanReadToken(Token))
            {
                var Principal = TokenHandler.ValidateToken(
                    Token, tokenValidationParameters, out SecurityToken SecurityToken);

                return Principal;
            }
            else
            {
                throw new SecurityTokenException("Invalid token");
            }
        }
    }
}
