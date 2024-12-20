using backend.Entities;

namespace backend.Interfaces
{
    public interface IFenceRepository
    {
        Task<List<Fence>> GetFenceList();
        Task<Fence> GetFenceById(int id);
    }
}