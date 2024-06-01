namespace backend.Interfaces
{
    public interface IUnitOfWork
    {
        IProjectsRepository ProjectsRepository { get; }
        IUserRepository UserRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}