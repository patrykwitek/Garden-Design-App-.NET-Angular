using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public DateTime? DateOfBirth { get; set; }
        
        [Required]
        [StringLength(16, MinimumLength = 4)]
        public string Password { get; set; }
    }
}