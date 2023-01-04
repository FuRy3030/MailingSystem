using Google.Apis.Auth;
using MailingSystem.Classes;
using MailingSystem.Entities;
using MailingSystem.Migrations;
using MailingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Security.Claims;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;

        public AuthController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("googleverification")]
        public async Task<IActionResult> GoogleVerification(string Token)
        {
            try
            {
                var GoogleUser = await GoogleJsonWebSignature.ValidateAsync(Token, 
                    new GoogleJsonWebSignature.ValidationSettings()
                    {
                        Audience = new[] { "104279093815-npg46ifu43hcogj2o1iovu4qbu1lph1t.apps.googleusercontent.com" }
                    });

                var PotentialUser = await UserManager.FindByEmailAsync(GoogleUser.Email);

                // Register
                if (PotentialUser == null)
                {
                    string RealName = GoogleUser.GivenName + " " + GoogleUser.FamilyName.Substring
                        (0, GoogleUser.FamilyName.IndexOf('|') - 1);
                    string UserName = AuthManagement.RandomString(12, true);
                    string RefreshToken = AuthManagement.GenerateRefreshToken();
                    string AccessToken = AuthManagement.GenerateJWTToken(UserName, GoogleUser.Email, RealName);
                    DateTime ExpirationTime = DateTime.UtcNow.AddHours(1);

                    ApplicationUser NewUser = new()
                    {
                        PictureURL = GoogleUser.Picture,
                        RealName = RealName,
                        Email = GoogleUser.Email,
                        SecurityStamp = Guid.NewGuid().ToString(),
                        UserName = UserName,
                        RefreshToken = RefreshToken,
                        LastAccessToken = AccessToken,
                        LastAccessTokenExpirationTime = ExpirationTime
                    };

                    var Result = await UserManager.CreateAsync(NewUser);

                    if (Result.Succeeded)
                    {
                        return Ok(new JWTTokenGroup(AccessToken, RefreshToken, ExpirationTime));
                    }
                    else
                    {
                        return BadRequest("Someting gone wrong");
                    }
                }
                // Login
                else
                {
                    string RefreshToken = AuthManagement.GenerateRefreshToken();
                    string AccessToken = AuthManagement.GenerateJWTToken(PotentialUser.UserName, 
                        GoogleUser.Email, PotentialUser.RealName);
                    DateTime ExpirationTime = DateTime.UtcNow.AddHours(1);

                    PotentialUser.PictureURL = GoogleUser.Picture;
                    PotentialUser.RefreshToken = RefreshToken;
                    PotentialUser.LastAccessToken = AccessToken;
                    PotentialUser.LastAccessTokenExpirationTime = ExpirationTime;

                    var Result = await UserManager.UpdateAsync(PotentialUser);

                    if (Result.Succeeded)
                    {
                        return Ok(new JWTTokenGroup(AccessToken, RefreshToken, ExpirationTime));
                    }
                    else
                    {
                        return BadRequest("Someting gone wrong");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
