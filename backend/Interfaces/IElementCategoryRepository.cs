using backend.Entities;

namespace backend.Interfaces
{
    public interface IElementCategoryRepository
    {
        Task<List<ElementCategory>> GetElementsList();
    }
}