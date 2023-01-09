using MailingSystem.UserActivityService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IO;
using System.Net.WebSockets;
using System.Text;

namespace MailingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ActivityLogController : ControllerBase
    {
        [HttpGet]
        [Route("get")]
        public async Task GetHistory()
        {
            try
            {
                if (HttpContext.WebSockets.IsWebSocketRequest)
                {
                    using (WebSocket CurrentSocket = await HttpContext.WebSockets.AcceptWebSocketAsync())
                    {
                        ActivityHistoryBuilder Builder = new ActivityHistoryBuilder();
                        ActivityService Service = new ActivityService(Builder);

                        Service.BuildActivityLogHistory();

                        string ResponseResult = JsonConvert.SerializeObject(Builder.GetHistory());

                        byte[] Buffer = new byte[1024 * 4];
                        WebSocketReceiveResult WebSocketResult = await CurrentSocket.ReceiveAsync(
                            new ArraySegment<byte>(Buffer), 
                            CancellationToken.None
                        );

                        while (!WebSocketResult.CloseStatus.HasValue)
                        {
                            byte[] ServerResponse = Encoding.UTF8.GetBytes(ResponseResult);

                            await CurrentSocket.SendAsync(
                                new ArraySegment<byte>(ServerResponse, 0, ServerResponse.Length), 
                                WebSocketResult.MessageType, 
                                WebSocketResult.EndOfMessage, 
                                CancellationToken.None
                            );

                            WebSocketResult = await CurrentSocket.ReceiveAsync(
                                new ArraySegment<byte>(Buffer),
                                CancellationToken.None
                            );
                        }

                        await CurrentSocket.CloseAsync(
                            WebSocketResult.CloseStatus.Value, 
                            WebSocketResult.CloseStatusDescription, 
                            CancellationToken.None
                        );
                    }
                }
                else
                {
                    HttpContext.Response.StatusCode = 400;
                }
            }
            catch
            {
                HttpContext.Response.StatusCode = 400;
            }
        }
    }
}
