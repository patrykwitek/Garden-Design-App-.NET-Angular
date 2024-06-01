using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data.Context;
using backend.DTO;
using backend.Entities;
using backend.Helpers;
using backend.Interfaces;

namespace backend.Repositories
{
    public class ProjectsRepository : IProjectsRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProjectsRepository(
            DataContext context,
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddProject(Project project)
        {
            _context.Projects.Add(project);
        }

        public void DeleteProject(Project project)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedList<ProjectDto>> GetProjectsForUser(ProjectsParams projectsParams)
        {
            var query = _context.Projects
                .AsQueryable();

            query = query.Where(project => project.User.UserName == projectsParams.Username);

            var projects = query.ProjectTo<ProjectDto>(_mapper.ConfigurationProvider);

            return await PagedList<ProjectDto>.CreateAsync(projects, projectsParams.PageNumber, projectsParams.PageSize);
        }
    }
}