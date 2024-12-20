using backend.Entities;

namespace backend.DTO
{
    public class EditProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Width { get; set; }
        public int Depth { get; set; }
        public Ground Ground { get; set; }
        public Fence Fence { get; set; }
        public Entities.Environment Environment { get; set; }
    }
}