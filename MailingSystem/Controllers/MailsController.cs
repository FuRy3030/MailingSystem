using Azure;
using Azure.Core;
using MailingSystem.Classes;
using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Entities.BackupEntities;
using MailingSystem.MailServices;
using MailingSystem.Models;
using MailingSystem.UserActivityService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

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

        private async Task<EmailsGroups> CheckWhichEmailsRepeat(List<string> Emails, string RealName, 
            string Username, string PictureURL)
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

                            MailStatistics CurrentMailStatistics = new MailStatistics(true);

                            OrganizationMail CurrentMail = new OrganizationMail(
                                TrimmedEmail,
                                string.Concat(OrganizationAlias[0].ToString().ToUpper(), OrganizationAlias.AsSpan(1)),
                                RealName,
                                Username,
                                0,
                                DateTime.UtcNow,
                                CurrentMailStatistics
                            );                          

                            CurrentCheckGroup.NewMails.Add(CurrentMail);
                        }
                    }
                }

                await Context.AddRangeAsync(CurrentCheckGroup.NewMails);
                await Context.SaveChangesAsync();

                MailActivityFactory MailActivityFactory = new MailActivityFactory();
                ActivityService Service = new ActivityService(MailActivityFactory);

                foreach (OrganizationMail Mail in CurrentCheckGroup.NewMails)
                {
                    Service.CreateActivityLog(Mail.MailId, PictureURL, RealName, OperationType.Add);
                }
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
                    string UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;
                    string RealName = DecodedToken.Claims.First(Claim => Claim.Type == "given_name").Value;
                    string Username = DecodedToken.Claims.First(Claim => Claim.Type == "unique_name").Value;
                    var User = await UserManager.FindByEmailAsync(UserEmail);

                    List<string> Emails = AddMailsData.Emails.Split(',').ToList();

                    if (User != null)
                    {
                        string ResponseResult = JsonConvert.SerializeObject(await CheckWhichEmailsRepeat(
                            Emails, 
                            RealName, 
                            Username, 
                            User.PictureURL
                        ));   // serialize to JSON

                        return new ContentResult()
                        {
                            Content = ResponseResult,
                            ContentType = "application/json",
                            StatusCode = 200
                        };
                    }                   
                }

                return BadRequest("Something Went Wrong");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("addwithcompany")]
        public async Task<ActionResult> AddNewMailsWithCompanies([FromBody] AddMailsWithCompanyModel Model)
        {
            try
            {
                List<OrganizationMail> NewMails = new List<OrganizationMail>();
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(Model.AccessToken);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && Model.MailsWithCompanies.Count > 0)
                {
                    string RealName = DecodedToken.Claims.First(Claim => Claim.Type == "given_name").Value;
                    string Username = DecodedToken.Claims.First(Claim => Claim.Type == "unique_name").Value;
                    string UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;
                    var User = await UserManager.FindByEmailAsync(UserEmail);

                    if (User == null)
                    {
                        return BadRequest("User not found!");
                    }

                    using (var Context = new MailsDbContext())
                    {                       
                        foreach (MailWithCompany MailWithCompany in Model.MailsWithCompanies)
                        {
                            if (!string.IsNullOrEmpty(MailWithCompany.MailAddress))
                            {
                                string TrimmedEmail = MailWithCompany.MailAddress.Trim();

                                bool IfExists = MailService.CheckIfMailExists(TrimmedEmail);

                                if (IfExists == false)
                                {
                                    MailStatistics CurrentMailStatistics = new MailStatistics(true);

                                    OrganizationMail CurrentMail = new OrganizationMail(
                                        TrimmedEmail,
                                        MailWithCompany.CompanyName,
                                        RealName,
                                        Username,
                                        0,
                                        DateTime.UtcNow,
                                        CurrentMailStatistics
                                    );

                                    NewMails.Add(CurrentMail);
                                }
                            }
                        }

                        await Context.AddRangeAsync(NewMails);
                        await Context.SaveChangesAsync();

                        MailActivityFactory MailActivityFactory = new MailActivityFactory();
                        ActivityService Service = new ActivityService(MailActivityFactory);

                        foreach (OrganizationMail Mail in NewMails)
                        {
                            Service.CreateActivityLog(
                                Mail.MailId, 
                                User.PictureURL, 
                                RealName, 
                                OperationType.Add
                            );
                        }

                        string ResponseResult = JsonConvert.SerializeObject(NewMails);
                        return new ContentResult()
                        {
                            Content = ResponseResult,
                            ContentType = "application/json",
                            StatusCode = 200
                        };
                    }
                }

                return BadRequest("Something Went Wrong");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("getallrecent")]
        public async Task<ActionResult> GetAllRecentMails()
        {
            try
            {
                using (var Context = new MailsDbContext())
                {
                    List<OrganizationMail> SortedRecentMails = Context.OrganizationMails
                        .OrderByDescending(Mail => Mail.DateOfLastEmailSent)
                        .Select(Mail => Mail)
                        .ToList();

                    string ResponseResult = JsonConvert.SerializeObject(SortedRecentMails);
                    return new ContentResult()
                    {
                        Content = ResponseResult,
                        ContentType = "application/json",
                        StatusCode = 200
                    };
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut]
        [Route("edit")]
        public async Task<ActionResult> EditRecentMail([FromBody] RecentEmailModel RecentEmailModel)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(RecentEmailModel.AccessToken);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && (RecentEmailModel.RecentEmail.MailAddress != null &&
                    RecentEmailModel.RecentEmail.UserWhoAdded != null))
                {
                    string UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;
                    string Username = DecodedToken.Claims.First(Claim => Claim.Type == "unique_name").Value;
                    string RealName = DecodedToken.Claims.First(Claim => Claim.Type == "given_name").Value;
                    var User = await UserManager.FindByEmailAsync(UserEmail);

                    if (User == null)
                    {
                        return BadRequest("User not found!");
                    }

                    using (var Context = new MailsDbContext())
                    {
                        OrganizationMail? CurrentMail = Context.OrganizationMails
                            .Where(Mail => Mail.MailId == RecentEmailModel.RecentEmail.MailId && 
                                Mail.UserVerificatiorName == Username)
                            .Select(Mail => Mail)
                            .FirstOrDefault();

                        if (CurrentMail != null)
                        {
                            if (CurrentMail.MailAddress != RecentEmailModel.RecentEmail.MailAddress &&
                                MailOperations.CheckIfEmailExists(RecentEmailModel.RecentEmail.MailAddress))
                            {
                                return BadRequest("Mail already exists");
                            }

                            CurrentMail.MailAddress = RecentEmailModel.RecentEmail.MailAddress;
                            CurrentMail.OrganizationName = RecentEmailModel.RecentEmail.OrganizationName;
                            CurrentMail.UserWhoAdded = RecentEmailModel.RecentEmail.UserWhoAdded;
                            CurrentMail.NumberOfEmailsSent =
                                RecentEmailModel.RecentEmail.NumberOfEmailsSent;
                            CurrentMail.DateOfLastEmailSent =
                                RecentEmailModel.RecentEmail.DateOfLastEmailSent;

                            await Context.SaveChangesAsync();

                            MailActivityFactory MailActivityFactory = new MailActivityFactory();
                            ActivityService Service = new ActivityService(MailActivityFactory);
                            Service.CreateActivityLog(
                                CurrentMail.MailId,
                                User.PictureURL,
                                RealName,
                                OperationType.Edit
                            );

                            return new ContentResult()
                            {
                                Content = "Success",
                                ContentType = "application/json",
                                StatusCode = 200,
                            };
                        }
                    }
                }

                return BadRequest("Object to modify not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("delete")]
        public async Task<ActionResult> DeleteRecentMail([FromQuery] string Token, [FromQuery] int MailId)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && MailId != null)
                {
                    string UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;
                    string Username = DecodedToken.Claims.First(Claim => Claim.Type == "unique_name").Value;
                    string RealName = DecodedToken.Claims.First(Claim => Claim.Type == "given_name").Value;
                    var User = await UserManager.FindByEmailAsync(UserEmail);

                    if (User == null)
                    {
                        return BadRequest("User not found!");
                    }

                    using (var Context = new MailsDbContext())
                    {
                        OrganizationMail? FoundMailEntity = Context.OrganizationMails
                            .Where(Mail => Mail.UserVerificatiorName == Username && Mail.MailId == MailId)
                            .FirstOrDefault();

                        if (FoundMailEntity != null)
                        {
                            MailActivityFactory MailActivityFactory = new MailActivityFactory();
                            ActivityService Service = new ActivityService(MailActivityFactory);
                            Service.CreateActivityLog(
                                FoundMailEntity.MailId,
                                User.PictureURL,
                                RealName,
                                OperationType.Delete
                            );

                            Context.Remove(FoundMailEntity);
                            await Context.SaveChangesAsync();                         

                            return new ContentResult()
                            {
                                Content = "Success",
                                ContentType = "application/json",
                                StatusCode = 200
                            };
                        }
                    }
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
