using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("Environments")]
    public class Environment
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}