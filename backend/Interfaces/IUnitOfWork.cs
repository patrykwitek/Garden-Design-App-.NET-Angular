namespace backend.Interfaces
{
    public interface IUnitOfWork
    {
        IProjectsRepository ProjectsRepository { get; }
        IUserRepository UserRepository { get; }
        IGroundRepository GroundRepository { get; }
        IFenceRepository FenceRepository { get; }
        IEntranceRepository EntranceRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}