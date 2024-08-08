using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("Fences")]
    public class Fence
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Img { get; set; }
    }
}