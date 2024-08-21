using backend.DTO;
using backend.Entities;

namespace backend.Interfaces
{
    public interface IEntranceRepository
    {
        void AddEntrance(Entrance entrance);
        Task<List<EntranceDto>> GetEntranceListForProject(int projectId);
    }
}