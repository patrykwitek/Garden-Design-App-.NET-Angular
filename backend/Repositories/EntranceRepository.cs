using AutoMapper;
using backend.Data.Context;
using backend.DTO;
using backend.Entities;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class EntranceRepository : IEntranceRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public EntranceRepository(
            DataContext context,
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddEntrance(Entrance entrance)
        {
            _context.Entrances.Add(entrance);
        }

        public async Task<List<EntranceDto>> GetEntranceListForProject(int projectId)
        {
            return await _context.Entrances
                .Where(entrance => entrance.ProjectId == projectId)
                .Select(entrance => new EntranceDto
                {
                    Direction = entrance.Direction,
                    Position = entrance.Position
                })
                .ToListAsync();
        }
    }
}