using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("GardenElements")]
    public class GardenElement
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public double PositionX { get; set; }
        public double PositionY { get; set; }
        public int ProjectId { get; set; }
        public double? RotationX { get; set; }
        public double? RotationY { get; set; }
    }
}