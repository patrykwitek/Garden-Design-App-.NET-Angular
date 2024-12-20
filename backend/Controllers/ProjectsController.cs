using backend.DTO;
using backend.Entities;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class ProjectsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProjectsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateProject(CreateProjectDto projectDto)
        {
            string username = User.GetUsername();

            User projectOwner = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            Ground ground = await _unitOfWork.GroundRepository.GetGroundById(projectDto.Ground.Id);
            Entities.Environment environment = await _unitOfWork.EnvironmentRepository.GetEnvironmentById(projectDto.Environment.Id);
            Fence fence = await _unitOfWork.FenceRepository.GetFenceById(projectDto.Fence.Id);

            Project project = new Project
            {
                Name = projectDto.Name,
                IsDeleted = false,
                DateCreated = DateTime.UtcNow,
                Width = projectDto.Width,
                Depth = projectDto.Depth,
                User = projectOwner,
                Ground = ground,
                Environment = environment,
                Fence = fence
            };

            _unitOfWork.ProjectsRepository.AddProject(project);

            if (await _unitOfWork.Complete())
            {
                return Ok();
            }

            return BadRequest("Failed to create the project");
        }

        [HttpGet("getProjects")]
        public async Task<ActionResult<PagedList<ProjectDto>>> GetProjects([FromQuery] ProjectsParams projectsParams)
        {
            projectsParams.Username = User.GetUsername();

            var projects = await _unitOfWork.ProjectsRepository.GetProjectsForUser(projectsParams);

            Response.AddPaginationHeader(new PaginationHeader(projects.CurrentPage, projects.PageSize, projects.TotalCount, projects.TotalPages));

            return Ok(projects);
        }

        [HttpGet("getAllUsersProjects")]
        public async Task<ActionResult<PagedList<ProjectDto>>> GetAllUsersProjects([FromQuery] PaginationParams projectsParams)
        {
            var projects = await _unitOfWork.ProjectsRepository.GetAllProjects(projectsParams);

            Response.AddPaginationHeader(new PaginationHeader(projects.CurrentPage, projects.PageSize, projects.TotalCount, projects.TotalPages));

            return Ok(projects);
        }

        [HttpPut("delete/{id}")]
        public async Task<ActionResult> DeleteProject(int id)
        {
            Project project = await _unitOfWork.ProjectsRepository.GetProjectByIdAsync(id);
            project.IsDeleted = true;

            if (await _unitOfWork.Complete())
            {
                return Ok();
            }

            return BadRequest("Failed to delete the project");
        }

        [HttpPut("edit")]
        public async Task<ActionResult> EditProject(EditProjectDto projectDto)
        {
            Project project = await _unitOfWork.ProjectsRepository.GetProjectByIdAsync(projectDto.Id);

            Ground ground = await _unitOfWork.GroundRepository.GetGroundById(projectDto.Ground.Id);
            Entities.Environment environment = await _unitOfWork.EnvironmentRepository.GetEnvironmentById(projectDto.Environment.Id);
            Fence fence = await _unitOfWork.FenceRepository.GetFenceById(projectDto.Fence.Id);

            project.Name = projectDto.Name;
            project.Width = projectDto.Width;
            project.Depth = projectDto.Depth;
            project.Ground = ground;
            project.Fence = fence;
            project.Environment = environment;

            if (await _unitOfWork.Complete())
            {
                return Ok();
            }

            return BadRequest("Failed to edit the project");
        }
    }
}