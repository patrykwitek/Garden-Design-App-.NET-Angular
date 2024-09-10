using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("ElementCategories")]
    public class ElementCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}