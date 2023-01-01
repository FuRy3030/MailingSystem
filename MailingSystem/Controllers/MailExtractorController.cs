using MailingSystem.Models;
using MailingSystem.ScrapingServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MailExtractorController : Controller
    {
        private IHttpClientFactory ClientFactory;

        public MailExtractorController(IHttpClientFactory clientFactory)
        {
            ClientFactory = clientFactory;
        }

        [Authorize]
        [HttpPost]
        [Route("scrapenewmails")]
        public async Task<ActionResult> ScrapeNewMails([FromBody] ExtractorConfigurationModel Model)
        {
            try
            {
                List<ScrapedEmailEntity> NewScrapedMails = new List<ScrapedEmailEntity>();

                switch (Model.ExtractorSource)
                {
                    case "0":
                        NGOEntity NGOScrapeServices = new NGOEntity("NGO", ClientFactory);
                        await NGOScrapeServices.GetURLsWithOffers(Model.MailSource, Model.PageNumber);
                        NewScrapedMails = await NGOScrapeServices.ScrapeEmailsFromOffers();
                        break;
                    case "1":
                        break;                  
                }

                var ResponseResult = JsonConvert.SerializeObject(NewScrapedMails);
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
