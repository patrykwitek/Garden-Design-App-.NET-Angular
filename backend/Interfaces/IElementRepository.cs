using backend.Entities;

namespace backend.Interfaces
{
    public interface IElementRepository
    {
        Task<List<ElementCategory>> GetElementCategoriesList();
        Task<List<Element>> GetElementsListByCategory(string category);
    }
}