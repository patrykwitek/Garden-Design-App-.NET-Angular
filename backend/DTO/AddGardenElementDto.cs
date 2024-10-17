namespace backend.DTO
{
    public class AddGardenElementDto
    {
        public string Category { get; set; }
        public string Name { get; set; }
        public double PositionX { get; set; }
        public double PositionY { get; set; }
        public double? Rotation { get; set; }
    }
}