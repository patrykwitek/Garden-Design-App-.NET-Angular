using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data.Context;
using backend.DTO;
using backend.Entities;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(u => u.Projects)
                .FirstOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
           return await _context.Users
                .Include(u => u.Projects)
                .ToListAsync();
        }

        public void Update(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<PagedList<UserDataDto>> GetPaginatedUsersList(PaginationParams usersParams)
        {
            var query = _context.Users
                .AsQueryable();

            var usersList = query.ProjectTo<UserDataDto>(_mapper.ConfigurationProvider);

            return await PagedList<UserDataDto>.CreateAsync(usersList, usersParams.PageNumber, usersParams.PageSize);
        }
    }
}