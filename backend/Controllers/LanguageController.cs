using backend.DTO;
using backend.Entities;
using backend.Extensions;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class LanguageController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public LanguageController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPut("setLanguage")]
        public async Task<IActionResult> SetGround([FromBody] LanguageDto languageDto)
        {
            string username = User.GetUsername();

            User user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            if (user is null)
            {
                return NotFound("User not found");
            }

            user.Language = languageDto.Language;
            await _unitOfWork.Complete();

            return Ok();
        }
    }
}