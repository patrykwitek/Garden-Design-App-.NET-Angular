using backend.Entities;

namespace backend.DTO
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateCreated { get; set; }
        public int Width { get; set; }
        public int Depth { get; set; }
        public string OwnerUsername { get; set; }
        public Ground Ground{ get; set; }
        public Entities.Environment Environment { get; set; }
        public Fence Fence { get; set; }
        public List<EntranceDto> Entrances { get; set; }
    }
}