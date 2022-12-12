using MailingSystem.Contexts;
using MailingSystem.Entities;
using MailingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TemplatesController : ControllerBase
    {
        [Authorize]
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> AddTemplate([FromBody] TemplateModel TemplateModel)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(TemplateModel.Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && TemplateModel.Name != "" && TemplateModel.Type != null)
                {
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;

                    using (var Context = new TemplatesDbContext())
                    {
                        Template NewTemplate = new Template(
                            UserEmail, 
                            TemplateModel.Name,
                            TemplateModel.Type, 
                            TemplateModel.Topic, 
                            TemplateModel.Content, 
                            DateTime.UtcNow
                        );

                        await Context.AddAsync(NewTemplate);
                        await Context.SaveChangesAsync();

                        var Response = new
                        {
                            ResponseText = "Success",
                            ResponseBody = new {
                                NewTemplate.Name,
                                NewTemplate.TemplateId,
                                NewTemplate.Type,
                                NewTemplate.Topic,
                                NewTemplate.Content,
                                NewTemplate.CreationDate,
                                NewTemplate.OwnerEmail,
                                TimePassedInDays = (DateTime.UtcNow.Date -
                                    NewTemplate.CreationDate.Date).Days
                            }
                        };

                        string JSONResponseResult = JsonConvert.SerializeObject(Response);

                        return new ContentResult()
                        {
                            Content = JSONResponseResult,
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
        [HttpPut]
        [Route("edit")]
        public async Task<ActionResult> EditTemplate([FromBody] TemplateModelWithId TemplateModel)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(TemplateModel.Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && TemplateModel.Name != "" && TemplateModel.Type != null)
                {
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;

                    using (var Context = new TemplatesDbContext())
                    {
                        Template? CurrentTemplate = Context.Templates
                            .Where(Template => Template.OwnerEmail == UserEmail && 
                                Template.TemplateId == TemplateModel.TemplateId)
                            .Select(Template => Template)
                            .FirstOrDefault();

                        if (CurrentTemplate != null)
                        {
                            CurrentTemplate.Name = TemplateModel.Name;
                            CurrentTemplate.Type = TemplateModel.Type;
                            CurrentTemplate.Content = TemplateModel.Content;
                            CurrentTemplate.Topic = TemplateModel.Topic;

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

                return BadRequest("Error");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("delete")]
        public async Task<ActionResult> DeleteTemplate([FromQuery] string Token, [FromQuery] int TemplateId)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null && TemplateId != null)
                {
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;

                    using (var Context = new TemplatesDbContext())
                    {
                        Template? FoundTemplateEntity = Context.Templates
                            .Where(Template => Template.OwnerEmail == UserEmail && Template.TemplateId == TemplateId)
                            .FirstOrDefault();

                        if (FoundTemplateEntity != null)
                        {
                            Context.Remove(FoundTemplateEntity);
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

        [Authorize]
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetAllTemplates([FromQuery] string Token)
        {
            try
            {
                var Handler = new JwtSecurityTokenHandler();
                var JsonToken = Handler.ReadToken(Token);
                var DecodedToken = JsonToken as JwtSecurityToken;

                if (DecodedToken != null)
                {
                    var UserEmail = DecodedToken.Claims.First(Claim => Claim.Type == "email").Value;

                    using (var Context = new TemplatesDbContext())
                    {
                        var SortedUserTemplates = Context.Templates
                            .Where(Template => Template.OwnerEmail == UserEmail)
                            .Select(Template => new
                            {
                                Template.Name,
                                Template.TemplateId,
                                Template.Type,
                                Template.Topic,
                                Template.Content,
                                Template.CreationDate,
                                Template.OwnerEmail,
                                TimePassedInDays = (DateTime.UtcNow.Date - 
                                    Template.CreationDate.Date).Days
                            })
                            .OrderByDescending(Template => Template.CreationDate)                           
                            .ToList();

                        var ResponseResult = JsonConvert.SerializeObject(SortedUserTemplates);
                        return new ContentResult()
                        {
                            Content = ResponseResult,
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
    }
}
