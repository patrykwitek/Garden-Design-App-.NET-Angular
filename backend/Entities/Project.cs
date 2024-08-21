using System.ComponentModel.DataAnnotations.Schema;
using backend.DTO;
using Microsoft.EntityFrameworkCore;

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
        public Ground Ground { get; set; }
        public Fence Fence { get; set; }
        public List<Entrance> Entrances { get; set;} = new List<Entrance>();
    }
}