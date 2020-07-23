using Microsoft.EntityFrameworkCore.Migrations;

namespace DatingApp.Migrations
{
    public partial class userextended : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Intrests",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "Interests",
                table: "users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Interests",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "Intrests",
                table: "users",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
