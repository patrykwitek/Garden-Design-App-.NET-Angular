using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("Elements")]
    public class Element
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
    }
}