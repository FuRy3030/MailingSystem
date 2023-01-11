namespace MailingSystem.StatisticsServices
{
    public abstract class StatisticsFacade
    {
        public abstract IUserStatistics BuildStatisticsFacade(string Identifier, string PictureURL);
    }

    public class UsersStatisticsFacade : StatisticsFacade
    {
        private IUserStatistics FacadeStatistics { get; set; }
        protected ITrackingStatisticsService TrackingStatisticsService { get; set; }
        protected IChartDataService ChartDataService { get; set; }
        protected IBasicStatisticsService BasicStatisticsService { get; set; }

        public UsersStatisticsFacade(ITrackingStatisticsService trackingStatisticsService,
            IChartDataService chartDataService, IBasicStatisticsService basicStatisticsService)
        {
            TrackingStatisticsService = trackingStatisticsService;
            ChartDataService = chartDataService;
            BasicStatisticsService = basicStatisticsService;
            FacadeStatistics = new ActivityMailStatistics();
        }

        public override IUserStatistics BuildStatisticsFacade(string Identifier, string PictureURL)
        {
            this.FacadeStatistics.TrackingStatistics = new TrackingStatistics();
            this.FacadeStatistics.ChartData = new List<ChartData>();

            this.FacadeStatistics.TrackingStatistics.UniqueCampaigns = 
                this.TrackingStatisticsService.GetUniqueCampaigns();

            this.FacadeStatistics.TrackingStatistics.UniqueOpens =
                this.TrackingStatisticsService.GetUniqueOpens();

            this.FacadeStatistics.TrackingStatistics.UniqueClicks =
                this.TrackingStatisticsService.GetUniqueClicks();

            this.FacadeStatistics.TrackingStatistics.UniqueReplies =
                this.TrackingStatisticsService.GetUniqueReplies();

            this.FacadeStatistics.ChartData = this.ChartDataService.GetChartData();
            this.FacadeStatistics.MailCount = this.BasicStatisticsService.GetMailCount();
            this.FacadeStatistics.Identifier = Identifier;
            this.FacadeStatistics.PictureURL = PictureURL;

            return this.FacadeStatistics;
        }
    }

    public class TeamStatisticsFacade : StatisticsFacade
    {
        private IUserStatistics FacadeStatistics { get; set; }
        protected ITrackingStatisticsService TrackingStatisticsService { get; set; }
        protected IChartDataService ChartDataService { get; set; }
        protected IBasicStatisticsService BasicStatisticsService { get; set; }

        public TeamStatisticsFacade(ITrackingStatisticsService trackingStatisticsService,
            IChartDataService chartDataService, IBasicStatisticsService basicStatisticsService)
        {
            TrackingStatisticsService = trackingStatisticsService;
            ChartDataService = chartDataService;
            BasicStatisticsService = basicStatisticsService;
            FacadeStatistics = new ActivityMailStatistics();
        }

        public override IUserStatistics BuildStatisticsFacade(string Identifier, string PictureURL)
        {
            this.FacadeStatistics.TrackingStatistics = new TrackingStatistics();
            this.FacadeStatistics.ChartData = new List<ChartData>();

            this.FacadeStatistics.TrackingStatistics.UniqueCampaigns =
                this.TrackingStatisticsService.GetUniqueCampaigns();

            this.FacadeStatistics.TrackingStatistics.UniqueOpens =
                this.TrackingStatisticsService.GetUniqueOpens();

            this.FacadeStatistics.TrackingStatistics.UniqueClicks =
                this.TrackingStatisticsService.GetUniqueClicks();

            this.FacadeStatistics.TrackingStatistics.UniqueReplies =
                this.TrackingStatisticsService.GetUniqueReplies();

            this.FacadeStatistics.ChartData = this.ChartDataService.GetChartData();
            this.FacadeStatistics.MailCount = this.BasicStatisticsService.GetMailCount();
            this.FacadeStatistics.Identifier = Identifier;
            this.FacadeStatistics.PictureURL = PictureURL;

            return this.FacadeStatistics;
        }
    }
}
