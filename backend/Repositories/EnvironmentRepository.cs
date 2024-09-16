using backend.Data.Context;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class EnvironmentRepository : IEnvironmentRepository
    {
        private readonly DataContext _context;

        public EnvironmentRepository(
            DataContext context
        )
        {
            _context = context;
        }

        public async Task<List<Entities.Environment>> GetEnvironmentList()
        {
            return await _context.Environments.ToListAsync();
        }
    }
}