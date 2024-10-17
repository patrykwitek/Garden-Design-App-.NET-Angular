using backend.DTO;
using backend.Entities;

namespace backend.Interfaces
{
    public interface IElementRepository
    {
        Task<List<ElementCategory>> GetElementCategoriesList();
        Task<List<Element>> GetElementsListByCategory(string category);
        void AddGardenElement(GardenElement gardenElement);
        Task<List<GardenElement>> GetElementListForGarden(int projectId);
    }
}