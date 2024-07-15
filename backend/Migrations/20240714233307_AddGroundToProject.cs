using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class AddGroundToProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroundId",
                table: "Projects",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Grounds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Img = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grounds", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_GroundId",
                table: "Projects",
                column: "GroundId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Grounds_GroundId",
                table: "Projects",
                column: "GroundId",
                principalTable: "Grounds",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Grounds_GroundId",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "Grounds");

            migrationBuilder.DropIndex(
                name: "IX_Projects_GroundId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "GroundId",
                table: "Projects");
        }
    }
}
