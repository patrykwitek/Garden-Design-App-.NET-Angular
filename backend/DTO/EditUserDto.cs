namespace backend.DTO
{
    public class EditUserDto
    {
        public string OldUsername { get; set; }
        public string NewUsername { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}