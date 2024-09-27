namespace backend.Interfaces
{
    public interface IGroundRepository
    {
        Task<List<Ground>> GetGroundList();
        Task<Ground> GetGroundById(int id);
    }
}