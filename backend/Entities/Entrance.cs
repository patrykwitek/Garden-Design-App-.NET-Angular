using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Entities
{
    [Table("Entrances")]
    public class Entrance
    {
        public int Id { get; set; }
        public string Direction { get; set; }
        public double Position { get; set; }
        public int ProjectId { get; set; }
    }
}