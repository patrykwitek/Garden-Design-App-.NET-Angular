using backend.Data.Context;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend;

public class GroundRepository : IGroundRepository
{
    private readonly DataContext _context;

    public GroundRepository(
        DataContext context
    )
    {
        _context = context;
    }

    public async Task<Ground> GetGroundById(int id)
    {
        return await _context.Grounds.FirstOrDefaultAsync(ground => ground.Id == id);
    }

    public async Task<List<Ground>> GetGroundList()
    {
        return await _context.Grounds.ToListAsync();
    }
}
