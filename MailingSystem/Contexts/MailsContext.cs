using EntityFramework.Exceptions.SqlServer;
using MailingSystem.Entities;
using MailingSystem.Migrations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MailingSystem.Contexts
{
    public class MailsDbContext : DbContext
    {
        public DbSet<OrganizationMail> OrganizationMails { get; set; }

        public MailsDbContext() : base()
        {

        }

        public MailsDbContext(DbContextOptions<MailsDbContext> options) : base(options)
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
