using backend.Data.Context;
using backend.Entities;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ElementCategoryRepository : IElementCategoryRepository
    {
        private readonly DataContext _context;

        public ElementCategoryRepository(
            DataContext context
        )
        {
            _context = context;
        }

        public async Task<List<ElementCategory>> GetElementsList()
        {
            return await _context.ElementCategories.ToListAsync();
        }
    }
}