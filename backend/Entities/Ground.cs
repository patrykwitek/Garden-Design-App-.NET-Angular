using System.ComponentModel.DataAnnotations.Schema;

namespace backend;

[Table("Grounds")]
public class Ground
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Img { get; set; }
    public string Description { get; set; }
}