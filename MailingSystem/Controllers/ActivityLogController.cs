using MailingSystem.Entities;
using MailingSystem.StatisticsServices;
using MailingSystem.UserActivityService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> UserManager;

        public ActivityLogController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }

        [HttpGet]
        [Route("gethistory")]
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

        [HttpGet]
        [Route("getstatistics")]
        public async Task GetStatistics()
        {
            try
            {
                if (HttpContext.WebSockets.IsWebSocketRequest)
                {
                    using (WebSocket CurrentSocket = await HttpContext.WebSockets.AcceptWebSocketAsync())
                    {
                        List<ApplicationUser> Users = UserManager.Users.ToList();
                        List<IUserStatistics> ActivityMailStatisticsList = 
                            new List<IUserStatistics>();

                        TrackingStatisticsServiceLastMonthTeam TeamTrackingStatistics = 
                            new TrackingStatisticsServiceLastMonthTeam();
                        ChartDataServicePastSevenWeeksTeam ChartDataTeam = 
                            new ChartDataServicePastSevenWeeksTeam();
                        BasicStatisticsServiceLastMonthTeam BasicStatisticsTeam = 
                            new BasicStatisticsServiceLastMonthTeam();

                        TeamStatisticsFacade TeamStatistics = new TeamStatisticsFacade(
                            TeamTrackingStatistics,
                            ChartDataTeam,
                            BasicStatisticsTeam
                        );

                        ActivityMailStatisticsList.Add(TeamStatistics.BuildStatisticsFacade());

                        List<Task> AddUsersStatisticsTaskList = new List<Task>();

                        foreach (ApplicationUser User in Users)
                        {
                            AddUsersStatisticsTaskList.Add(Task.Run(() =>
                            {
                                TrackingStatisticsServiceLastMonth TrackingStatistics =
                                    new TrackingStatisticsServiceLastMonth(User.Email, User.UserName);
                                ChartDataServicePastSevenWeeks ChartData =
                                    new ChartDataServicePastSevenWeeks(User.Email);
                                BasicStatisticsServiceLastMonth BasicStatistics =
                                    new BasicStatisticsServiceLastMonth(User.Email);

                                UsersStatisticsFacade UserStatistics = new UsersStatisticsFacade(
                                    TrackingStatistics,
                                    ChartData,
                                    BasicStatistics
                                );

                                ActivityMailStatisticsList.Add(UserStatistics.BuildStatisticsFacade());
                            }));
                        }

                        Task.WhenAll(AddUsersStatisticsTaskList);

                        string ResponseResult = JsonConvert.SerializeObject(ActivityMailStatisticsList);

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
