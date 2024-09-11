using backend.Data.Context;
using backend.Entities;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ElementRepository : IElementRepository
    {
        private readonly DataContext _context;

        public ElementRepository(
            DataContext context
        )
        {
            _context = context;
        }

        public async Task<List<ElementCategory>> GetElementCategoriesList()
        {
            return await _context.ElementCategories.ToListAsync();
        }

        public async Task<List<Element>> GetElementsListByCategory(string category)
        {
            return await _context.Elements
                .Where(element => element.Category == category)
                .ToListAsync();
        }
    }
}