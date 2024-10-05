using backend.DTO;
using backend.Entities;
using backend.Helpers;

namespace backend.Interfaces
{
    public interface IProjectsRepository
    {
        void AddProject(Project project);
        Task<PagedList<ProjectDto>> GetProjectsForUser(ProjectsParams projectsParams);
        Task<PagedList<ProjectDto>> GetAllProjects(PaginationParams projectsParams);
        Task<Project> GetProjectByIdAsync(int id);
    }
}