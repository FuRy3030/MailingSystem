namespace MailingSystem.StatisticsServices
{
    public interface IUserStatistics
    {
        List<ChartData> ChartData { get; set; }
        TrackingStatistics TrackingStatistics { get; set; }
        int MailCount { get; set; }
    }
}
