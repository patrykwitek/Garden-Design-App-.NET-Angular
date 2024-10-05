using backend.DTO;
using backend.Entities;
using backend.Helpers;

namespace backend.Interfaces
{
    public interface IUserRepository
    {
        void Update(User user);
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByUsernameAsync(string username);
        Task<PagedList<UserDataDto>> GetPaginatedUsersList(PaginationParams usersParams);
    }
}