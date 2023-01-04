using EntityFramework.Exceptions.SqlServer;
using MailingSystem.Entities;
using MailingSystem.Entities.BackupEntities;
using Microsoft.EntityFrameworkCore;

namespace MailingSystem.Contexts
{
    public class ActivityLogDbContext : DbContext
    {
        public DbSet<MailActivityLog> MailLogs { get; set; }
        public DbSet<CampaignActivityLog> CampaignLogs { get; set; }
        public DbSet<TemplateActivityLog> TemplateLogs { get; set; }

        public ActivityLogDbContext() : base()
        {

        }

        public ActivityLogDbContext(DbContextOptions<ActivityLogDbContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot Configuration = new ConfigurationBuilder()
                   .SetBasePath(Directory.GetCurrentDirectory())
                   .AddJsonFile("appsettings.json")
                   .Build();
                var ConnectionString = Configuration.GetConnectionString("DataConnectionString");
                optionsBuilder.UseSqlServer(ConnectionString).UseExceptionProcessor();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MailActivityLog>()
               .Property(Mail => Mail.ActivityType)
               .HasConversion<int>();

            modelBuilder.Entity<CampaignActivityLog>()
               .Property(Campaign => Campaign.ActivityType)
               .HasConversion<int>();

            modelBuilder.Entity<TemplateActivityLog>()
               .Property(Template => Template.ActivityType)
               .HasConversion<int>();

            modelBuilder.Entity<TemplateActivityLog>()
               .Property(Template => Template.Type)
               .HasConversion<int>();
        }
    }
}
