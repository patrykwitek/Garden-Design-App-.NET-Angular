namespace backend.Interfaces
{
    public interface IUnitOfWork
    {
        IProjectsRepository ProjectsRepository { get; }
        IUserRepository UserRepository { get; }
        IGroundRepository GroundRepository { get; }
        IEnvironmentRepository EnvironmentRepository { get; }
        IFenceRepository FenceRepository { get; }
        IEntranceRepository EntranceRepository { get; }
        IElementRepository ElementRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}