using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MailingSystem.Migrations.MailsDb
{
    /// <inheritdoc />
    public partial class AddMailStatistics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SentMails");

            migrationBuilder.CreateTable(
                name: "MailStatistics",
                columns: table => new
                {
                    StatisticsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HasOpenedCampaign = table.Column<bool>(type: "bit", nullable: false),
                    DateOfLastOpen = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HasClickedLink = table.Column<bool>(type: "bit", nullable: false),
                    DateOfLastClick = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HasReplied = table.Column<bool>(type: "bit", nullable: false),
                    DateOfLastReply = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CurrentMailId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MailStatistics", x => x.StatisticsId);
                    table.ForeignKey(
                        name: "FK_MailStatistics_OrganizationMails_CurrentMailId",
                        column: x => x.CurrentMailId,
                        principalTable: "OrganizationMails",
                        principalColumn: "MailId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SentMailCampaigns",
                columns: table => new
                {
                    LocalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CampaignId = table.Column<int>(type: "int", nullable: false),
                    CampaignName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SenderMailAddress = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Topic = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumberOfFollowUps = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SentMailCampaigns", x => x.LocalId);
                });

            migrationBuilder.CreateTable(
                name: "OrganizationMailSentMailCampaign",
                columns: table => new
                {
                    OrganizationMailsMailId = table.Column<int>(type: "int", nullable: false),
                    SentMailCampaignsLocalId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationMailSentMailCampaign", x => new { x.OrganizationMailsMailId, x.SentMailCampaignsLocalId });
                    table.ForeignKey(
                        name: "FK_OrganizationMailSentMailCampaign_OrganizationMails_OrganizationMailsMailId",
                        column: x => x.OrganizationMailsMailId,
                        principalTable: "OrganizationMails",
                        principalColumn: "MailId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrganizationMailSentMailCampaign_SentMailCampaigns_SentMailCampaignsLocalId",
                        column: x => x.SentMailCampaignsLocalId,
                        principalTable: "SentMailCampaigns",
                        principalColumn: "LocalId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MailStatistics_CurrentMailId",
                table: "MailStatistics",
                column: "CurrentMailId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationMailSentMailCampaign_SentMailCampaignsLocalId",
                table: "OrganizationMailSentMailCampaign",
                column: "SentMailCampaignsLocalId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MailStatistics");

            migrationBuilder.DropTable(
                name: "OrganizationMailSentMailCampaign");

            migrationBuilder.DropTable(
                name: "SentMailCampaigns");

            migrationBuilder.CreateTable(
                name: "SentMails",
                columns: table => new
                {
                    SentMailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrganizationMailInstanceMailId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfDelivery = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SenderMailAddress = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Topic = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SentMails", x => x.SentMailId);
                    table.ForeignKey(
                        name: "FK_SentMails_OrganizationMails_OrganizationMailInstanceMailId",
                        column: x => x.OrganizationMailInstanceMailId,
                        principalTable: "OrganizationMails",
                        principalColumn: "MailId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SentMails_OrganizationMailInstanceMailId",
                table: "SentMails",
                column: "OrganizationMailInstanceMailId");
        }
    }
}
