namespace MailingSystem.StatisticsServices
{
    public class ActivityMailStatistics : IUserStatistics
    {
        public List<ChartData> ChartData { get; set; }
        public TrackingStatistics TrackingStatistics { get; set; }
        public int MailCount { get; set; }
    }

    public class ChartData
    {
        public int Value { get; set; }
        public string DateLabel { get; set; }
    }

    public class TrackingStatistics
    {
        public int UniqueCampaigns { get; set; }
        public int UniqueOpens { get; set; }
        public int UniqueClicks { get; set; }
        public int UniqueReplies { get; set; }
    }
}
