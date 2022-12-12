using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MailingSystem.Migrations.MailsDb
{
    /// <inheritdoc />
    public partial class SendMailInstanceEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SentMails",
                columns: table => new
                {
                    SentMailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SenderMailAddress = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Topic = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfDelivery = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OrganizationMailInstanceMailId = table.Column<int>(type: "int", nullable: false)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SentMails");
        }
    }
}
