namespace backend.Interfaces
{
    public interface IEnvironmentRepository
    {
        Task<List<Entities.Environment>> GetEnvironmentList();
    }
}