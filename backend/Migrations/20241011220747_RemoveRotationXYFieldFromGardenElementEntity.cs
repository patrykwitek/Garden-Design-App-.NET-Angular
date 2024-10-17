using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class RemoveRotationXYFieldFromGardenElementEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RotationX",
                table: "GardenElements");

            migrationBuilder.RenameColumn(
                name: "RotationY",
                table: "GardenElements",
                newName: "Rotation");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rotation",
                table: "GardenElements",
                newName: "RotationY");

            migrationBuilder.AddColumn<double>(
                name: "RotationX",
                table: "GardenElements",
                type: "REAL",
                nullable: true);
        }
    }
}
