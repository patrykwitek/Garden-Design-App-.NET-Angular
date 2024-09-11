using backend.DTO;
using backend.Entities;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class SolutionController : BaseApiController
{
    private readonly IUnitOfWork _unitOfWork;

    public SolutionController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpPut("setGround/{projectId}")]
    public async Task<IActionResult> SetGround(int projectId, [FromBody] Ground ground)
    {
        var project = await _unitOfWork.ProjectsRepository.GetProjectByIdAsync(projectId);

        if (project == null)
        {
            return NotFound("Project not found.");
        }

        project.Ground = ground;
        await _unitOfWork.Complete();

        return Ok(project);
    }

    [HttpGet("getGroundList")]
    public async Task<ActionResult<IEnumerable<Ground>>> GetGrounds()
    {
        return await _unitOfWork.GroundRepository.GetGroundList();
    }

    [HttpPut("setFence/{projectId}")]
    public async Task<IActionResult> SetFence(int projectId, [FromBody] Fence fence)
    {
        var project = await _unitOfWork.ProjectsRepository.GetProjectByIdAsync(projectId);

        if (project is null)
        {
            return NotFound("Project not found.");
        }

        project.Fence = fence;
        await _unitOfWork.Complete();

        return Ok(project);
    }

    [HttpGet("getFenceList")]
    public async Task<ActionResult<IEnumerable<Fence>>> GetFences()
    {
        return await _unitOfWork.FenceRepository.GetFenceList();
    }

    [HttpGet("getElementCategoriesList")]
    public async Task<ActionResult<IEnumerable<ElementCategory>>> GetElementCategoriesList()
    {
        return await _unitOfWork.ElementRepository.GetElementCategoriesList();
    }

    [HttpGet("getElementsListByCategory/{category}")]
    public async Task<ActionResult<IEnumerable<Element>>> GetElementsListByCategory(string category)
    {
        return await _unitOfWork.ElementRepository.GetElementsListByCategory(category);
    }

    [HttpPut("setEntrance/{projectId}")]
    public async Task<IActionResult> SetEntrance(int projectId, [FromBody] EntranceDto entranceDto)
    {
        var project = await _unitOfWork.ProjectsRepository.GetProjectByIdAsync(projectId);

        if (project is null)
        {
            return NotFound("Project not found.");
        }

        Entrance entrance = new Entrance
        {
            Direction = entranceDto.Direction,
            Position = entranceDto.Position,
            ProjectId = projectId
        };
        
        _unitOfWork.EntranceRepository.AddEntrance(entrance);
        project.Entrances.Add(entrance);
        
        await _unitOfWork.Complete();

        return Ok(project);
    }
    
    [HttpGet("getEntrancesForProject/{projectId}")]
    public async Task<ActionResult<IEnumerable<EntranceDto>>> GetEntrancesForProject(int projectId)
    {
        return await _unitOfWork.EntranceRepository.GetEntranceListForProject(projectId);
    }
}
