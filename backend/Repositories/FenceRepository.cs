using backend.Data.Context;
using backend.Entities;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend;

public class FenceRepository : IFenceRepository
{
    private readonly DataContext _context;

    public FenceRepository(
        DataContext context
    )
    {
        _context = context;
    }

    public async Task<Fence> GetFenceById(int id)
    {
        return await _context.Fences.FirstOrDefaultAsync(fence => fence.Id == id);
    }

    public async Task<List<Fence>> GetFenceList()
    {
        return await _context.Fences.ToListAsync();
    }
}