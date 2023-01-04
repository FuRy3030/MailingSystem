using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MailingSystem.Migrations.ActivityLogDb
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CampaignLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PictureURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserRealName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivityType = table.Column<int>(type: "int", nullable: false),
                    ActivityTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NumberOfFollowUps = table.Column<int>(type: "int", nullable: false),
                    EmailsString = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampaignLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MailLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PictureURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserRealName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivityType = table.Column<int>(type: "int", nullable: false),
                    ActivityTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MailLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TemplateLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PictureURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserRealName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivityType = table.Column<int>(type: "int", nullable: false),
                    ActivityTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Topic = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateLogs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CampaignLogs");

            migrationBuilder.DropTable(
                name: "MailLogs");

            migrationBuilder.DropTable(
                name: "TemplateLogs");
        }
    }
}
