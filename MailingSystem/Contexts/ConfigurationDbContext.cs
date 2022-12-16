using MailingSystem.Entities;
using Microsoft.EntityFrameworkCore;
using EntityFramework.Exceptions.SqlServer;

namespace MailingSystem.Contexts
{
    public class ConfigurationDbContext : DbContext
    {
        public DbSet<MailsUserSettings> MailsSettings { get; set; }

        public ConfigurationDbContext() : base()
        {

        }

        public ConfigurationDbContext(DbContextOptions<ConfigurationDbContext> options) : base(options)
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
        }
    }
}
