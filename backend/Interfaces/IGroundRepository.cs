namespace backend.Interfaces
{
    public interface IGroundRepository
    {
        Task<List<Ground>> GetGroundList();
    }
}