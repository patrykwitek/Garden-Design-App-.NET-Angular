using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("Projects")]
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public int Width { get; set; }
        public int Depth { get; set; }
        public User User { get; set; }
    }
}