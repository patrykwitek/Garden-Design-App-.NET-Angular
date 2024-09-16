using AutoMapper;
using backend.Data.Context;
using backend.Interfaces;
using backend.Repositories;

namespace backend.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IProjectsRepository ProjectsRepository => new ProjectsRepository(_context, _mapper);
        public IUserRepository UserRepository => new UserRepository(_context, _mapper);
        public IGroundRepository GroundRepository => new GroundRepository(_context);
        public IFenceRepository FenceRepository => new FenceRepository(_context);
        public IEntranceRepository EntranceRepository => new EntranceRepository(_context, _mapper);
        public IElementRepository ElementRepository => new ElementRepository(_context);
        public IEnvironmentRepository EnvironmentRepository => new EnvironmentRepository(_context);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}