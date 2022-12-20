using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConfigurationController : ControllerBase
    {
        [Authorize]
        [HttpPost]
        [Route("updatemailssettings")]
        public async Task<ActionResult> UpdateMailsSettings([FromQuery] string Token,
            [FromBody] MailsSettingsUserForm MailsSettingsUserForm)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && MailsSettingsUserForm.GMassAPIKey != "" &&
                    MailsSettingsUserForm.GMassAPIKey != null)
                {
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;

                    using (var Context = new ConfigurationDbContext())
                    {
                        MailsUserSettings? FoundEntity = Context.MailsSettings
                            .Where(Settings => Settings.Email == UserEmail)
                            .Select(Settings => Settings)
                            .FirstOrDefault();

                        if (FoundEntity != null)
                        {
                            FoundEntity.GMassAPIKey = MailsSettingsUserForm.GMassAPIKey;
                            FoundEntity.RecipientsSheetId = MailsSettingsUserForm.RecipientsSheetId;

                            await Context.SaveChangesAsync();
                        }
                        else
                        {
                            MailsUserSettings NewSettings = new MailsUserSettings(UserEmail,
                                MailsSettingsUserForm.GMassAPIKey, MailsSettingsUserForm.RecipientsSheetId);

                            Context.Add(NewSettings);
                            await Context.SaveChangesAsync();
                        }

                        return new ContentResult()
                        {
                            Content = "Success",
                            ContentType = "application/json",
                            StatusCode = 200
                        };
                    }
                }

                return BadRequest("Error");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("getsettings")]
        public async Task<ActionResult> GetUserSettings([FromQuery] string Token)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null)
                {
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;

                    using (var Context = new ConfigurationDbContext())
                    {
                        var UserMailSettings = Context.MailsSettings
                            .Where(Settings => Settings.Email == UserEmail)
                            .Select(Settings => new
                            {
                                GMassAPIKey = Settings.GMassAPIKey,
                                RecipientsSheetId = Settings.RecipientsSheetId
                            })
                            .FirstOrDefault();

                        if (UserMailSettings != null)
                        {
                            var UserWholeSettings = new
                            {
                                UserMailSettings = UserMailSettings
                            };

                            string ResponseResult = JsonConvert.SerializeObject(UserWholeSettings);   // serialize to JSON
                            return new ContentResult()
                            {
                                Content = ResponseResult,
                                ContentType = "application/json",
                                StatusCode = 200
                            };
                        }
                    }
                }

                return BadRequest("Error");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
