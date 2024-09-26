using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class AddEnvironmentEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnvironmentId",
                table: "Projects",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Environments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Environments", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_EnvironmentId",
                table: "Projects",
                column: "EnvironmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Environments_EnvironmentId",
                table: "Projects",
                column: "EnvironmentId",
                principalTable: "Environments",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Environments_EnvironmentId",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "Environments");

            migrationBuilder.DropIndex(
                name: "IX_Projects_EnvironmentId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "EnvironmentId",
                table: "Projects");
        }
    }
}
