using MailingSystem.Models;
using MailingSystem.ScrapingServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private IHttpClientFactory ClientFactory;

        public TestController(IHttpClientFactory clientFactory)
        {
            ClientFactory = clientFactory;
        }

        [HttpGet]
        [Route("testURLs")]
        public async Task<ActionResult> TestURLs()
        {
            try
            {
                UJEntity TestEntity = new UJEntity("NGO", ClientFactory);
                await TestEntity.GetURLsWithOffers(MailSource.Work, 1);
                HttpClient CurrentClient = ClientFactory.CreateClient();

                var ResponseResult = JsonConvert.SerializeObject(await TestEntity.ScrapeEmailsFromOffers());
                return new ContentResult()
                {
                    Content = ResponseResult,
                    ContentType = "application/json",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
