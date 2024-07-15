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

            Ground ground = (await _unitOfWork.GroundRepository.GetGroundList()).FirstOrDefault();

            Project project = new Project
            {
                Name = projectDto.Name,
                DateCreated = DateTime.UtcNow,
                Width = projectDto.Width,
                Depth = projectDto.Depth,
                User = projectOwner,
                Ground = ground
            };

            _unitOfWork.ProjectsRepository.AddProject(project);

            if (await _unitOfWork.Complete())
            {
                return Ok();
            }

            return BadRequest("Failed to send message");
        }

        [HttpGet("getProjects")]
        public async Task<ActionResult<PagedList<ProjectDto>>> GetProjects([FromQuery] ProjectsParams projectsParams)
        {
            projectsParams.Username = User.GetUsername();

            var projects = await _unitOfWork.ProjectsRepository.GetProjectsForUser(projectsParams);

            Response.AddPaginationHeader(new PaginationHeader(projects.CurrentPage, projects.PageSize, projects.TotalCount, projects.TotalPages));

            return Ok(projects);
        }
    }
}