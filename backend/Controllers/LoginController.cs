using System.Data;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using backend.Data.Context;
using backend.DTO;
using backend.Entities;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class LoginController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        private readonly IUnitOfWork _unitOfWork;

        public LoginController(
            DataContext context,
            ITokenService tokenService,
            IMapper mapper,
            IUnitOfWork unitOfWork
        )
        {
            _tokenService = tokenService;
            _context = context;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username))
            {
                return BadRequest("That username is taken");
            }

            var user = _mapper.Map<User>(registerDto);

            using var hmac = new HMACSHA512();

            user.UserName = registerDto.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;
            user.Role = "user";
            user.Language = "en";

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                Language = user.Language
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserName == loginDto.Username);

            if (user is null) return Unauthorized("Invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                Language = user.Language
            };
        }

        [HttpGet("getUsersList")]
        public async Task<ActionResult<PagedList<UserDataDto>>> GetUsersList([FromQuery] PaginationParams projectsParams)
        {
            PagedList<UserDataDto> usersList = await _unitOfWork.UserRepository.GetPaginatedUsersList(projectsParams);

            Response.AddPaginationHeader(new PaginationHeader(usersList.CurrentPage, usersList.PageSize, usersList.TotalCount, usersList.TotalPages));

            return Ok(usersList);
        }

        [HttpGet("getUserDataForEditProfile/{username}")]
        public async Task<ActionResult<GetUserDto>> GetUserDataForEditProfile(string username)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserName == username);

            if (user is null) return NotFound("User not found");

            return new GetUserDto
            {
                Username = user.UserName,
                DateOfBirth = user.DateOfBirth
            };
        }

        [HttpPut("editProfile")]
        public async Task<ActionResult> EditProject(EditUserDto editUserDto)
        {
            if (editUserDto.NewUsername != editUserDto.OldUsername && await UserExists(editUserDto.NewUsername))
            {
                return BadRequest("That username is taken");
            }

            User user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserName == editUserDto.OldUsername);

            if (user is null) return NotFound("User not found");

            user.UserName = editUserDto.NewUsername;
            user.DateOfBirth = editUserDto.DateOfBirth;

            if (await _context.SaveChangesAsync() > 0)
            {
                return Ok();
            }

            return BadRequest("Failed to edit the profile");
        }

        [Authorize(Roles = "admin")]
        [HttpPut("changeRole")]
        public async Task<ActionResult> ChangeRole(UserDataDto userData)
        {
            User user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserName == userData.Username);

            if (user is null) return NotFound("User not found");

            user.Role = (user.Role == "admin") ? "user" : "admin";

            if (await _context.SaveChangesAsync() > 0)
            {
                return Ok();
            }

            return BadRequest("Failed to change the role");
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}