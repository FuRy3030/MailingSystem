using EntityFramework.Exceptions.SqlServer;
using MailingSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace MailingSystem.Contexts
{
    public class TemplatesDbContext : DbContext
    {
        public DbSet<Template> Templates { get; set; }

        public TemplatesDbContext() : base()
        {

        }

        public TemplatesDbContext(DbContextOptions<TemplatesDbContext> options) : base(options)
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

            modelBuilder.Entity<Template>()
               .Property(Template => Template.Type)
               .HasConversion<int>();
        }
    }
}
