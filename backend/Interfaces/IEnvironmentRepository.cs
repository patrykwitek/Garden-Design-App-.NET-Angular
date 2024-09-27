namespace backend.Interfaces
{
    public interface IEnvironmentRepository
    {
        Task<List<Entities.Environment>> GetEnvironmentList();
        Task<Entities.Environment> GetEnvironmentById(int id);
    }
}