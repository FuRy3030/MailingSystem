using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MailingSystem.Migrations.MailsDb
{
    /// <inheritdoc />
    public partial class MailsInitial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrganizationMails",
                columns: table => new
                {
                    MailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MailAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrganizationName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserWhoAdded = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserVerificatiorName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumberOfEmailsSent = table.Column<int>(type: "int", nullable: false),
                    DateOfLastEmailSent = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationMails", x => x.MailId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrganizationMails");
        }
    }
}
