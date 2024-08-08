using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class AddFenceToProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FenceId",
                table: "Projects",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_FenceId",
                table: "Projects",
                column: "FenceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Fences_FenceId",
                table: "Projects",
                column: "FenceId",
                principalTable: "Fences",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Fences_FenceId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_FenceId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "FenceId",
                table: "Projects");
        }
    }
}
