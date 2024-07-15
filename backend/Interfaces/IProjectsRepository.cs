using backend.DTO;
using backend.Entities;
using backend.Helpers;

namespace backend.Interfaces
{
    public interface IProjectsRepository
    {
        void AddProject(Project project);
        void DeleteProject(Project project);
        Task<PagedList<ProjectDto>> GetProjectsForUser(ProjectsParams projectsParams);
        Task<Project> GetProjectByIdAsync(int id);
    }
}