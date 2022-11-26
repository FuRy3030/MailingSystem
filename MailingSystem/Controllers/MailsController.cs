using Azure;
using Azure.Core;
using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MailsController : ControllerBase
    {
        public class AddMailsModel
        {
            public string Emails { get; set; }
            public string AccessToken { get; set; }
        }

        private class EmailsGroups
        {
            public List<OrganizationMail> NewMails { get; set; }
            public List<OrganizationMail> MailsRepeated { get; set; }

            public EmailsGroups()
            {
                NewMails = new List<OrganizationMail>();
                MailsRepeated = new List<OrganizationMail>();
            }
        }

        private readonly UserManager<ApplicationUser> UserManager;

        public MailsController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }

        private async Task<EmailsGroups> CheckWhichEmailsRepeat(List<string> Emails, string RealName, string Username)
        {
            EmailsGroups CurrentCheckGroup = new EmailsGroups();

            using (var Context = new MailsDbContext())
            {
                foreach (string Email in Emails)
                {
                    if (!string.IsNullOrEmpty(Email))
                    {
                        string TrimmedEmail = Email.Trim();

                        var CurrentOrganizationMail = Context.OrganizationMails
                            .Where(Mail => Mail.MailAddress == TrimmedEmail)
                            .FirstOrDefault();

                        if (CurrentOrganizationMail != null)
                        {
                            CurrentCheckGroup.MailsRepeated.Add(CurrentOrganizationMail);
                        }
                        else
                        {
                            string? PartialOrganizationAlias = TrimmedEmail
                                .Substring(TrimmedEmail.LastIndexOf('@') + 1);
                            string OrganizationAlias = PartialOrganizationAlias
                                .Substring(0, PartialOrganizationAlias.IndexOf('.'));

                            OrganizationMail CurrentMail = new OrganizationMail(
                                TrimmedEmail,
                                string.Concat(OrganizationAlias[0].ToString().ToUpper(), OrganizationAlias.AsSpan(1)),
                                RealName,
                                Username,
                                1,
                                DateTime.UtcNow
                            );

                            CurrentCheckGroup.NewMails.Add(CurrentMail);
                        }
                    }
                }

                await Context.AddRangeAsync(CurrentCheckGroup.NewMails);
                await Context.SaveChangesAsync();
            }

            return CurrentCheckGroup;
        }

        [Authorize]
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> AddNewMails([FromBody] AddMailsModel AddMailsData)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(AddMailsData.AccessToken);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && (AddMailsData.Emails != "" && AddMailsData.Emails != null))
                {
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;
                    var RealName = DecodedToken.Claims.First(Claim => Claim.Type == "given_name").Value;
                    var Username = DecodedToken.Claims.First(Claim => Claim.Type == "unique_name").Value;
                    var User = await UserManager.FindByEmailAsync(UserEmail);

                    List<string> Emails = AddMailsData.Emails.Split(',').ToList();

                    var ResponseResult = JsonConvert.SerializeObject(await CheckWhichEmailsRepeat(Emails, RealName, Username));   // serialize to JSON
                    return new ContentResult()
                    {
                        Content = ResponseResult,
                        ContentType = "application/json",
                        StatusCode = 200
                    };
                }

                return BadRequest("Something Went Wrong");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
