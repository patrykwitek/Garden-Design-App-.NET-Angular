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

        if (project is null)
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

    [HttpPut("setEnvironment/{projectId}")]
    public async Task<IActionResult> SetEnvironment(int projectId, [FromBody] Entities.Environment environment)
    {
        var project = await _unitOfWork.ProjectsRepository.GetProjectByIdAsync(projectId);

        if (project is null)
        {
            return NotFound("Project not found.");
        }

        if (project.Environment != environment)
        {
            project.Environment = environment;
            await _unitOfWork.Complete();
        }

        return Ok(project);
    }

    [HttpGet("getEnvironmentList")]
    public async Task<ActionResult<IEnumerable<Entities.Environment>>> GetEnvironments()
    {
        return await _unitOfWork.EnvironmentRepository.GetEnvironmentList();
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
        Project project = await _unitOfWork.ProjectsRepository.GetProjectByIdAsync(projectId);

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

    [HttpPost("addGardenElement/{projectId}")]
    public async Task<ActionResult> AddGardenElement(int projectId, AddGardenElementDto addGardenElementDto)
    {
        Project project = await _unitOfWork.ProjectsRepository.GetProjectByIdAsync(projectId);

        if (project is null)
        {
            return NotFound("Project not found.");
        }

        GardenElement gardenElement = new GardenElement
        {
            Name = addGardenElementDto.Name,
            Category = addGardenElementDto.Category,
            PositionX = addGardenElementDto.PositionX,
            PositionY = addGardenElementDto.PositionY,
            Rotation = addGardenElementDto.Rotation,
            IsDeleted = false,
            ProjectId = projectId
        };

        _unitOfWork.ElementRepository.AddGardenElement(gardenElement);
        project.GardenElements.Add(gardenElement);

        if (await _unitOfWork.Complete())
        {
            return Ok();
        }

        return BadRequest("Failed to add element: " + gardenElement.Name);
    }

    [HttpPut("removeGardenElement/{id}")]
    public async Task<ActionResult> RemoveGardenElement(int id)
    {
        GardenElement element = await _unitOfWork.ElementRepository.GetElementByIdAsync(id);
        element.IsDeleted = true;

        if (await _unitOfWork.Complete())
        {
            return Ok();
        }

        return BadRequest("Failed to delete the element");
    }

    [HttpGet("getElementsForProject/{projectId}")]
    public async Task<ActionResult<IEnumerable<GardenElement>>> GetElementsForProject(int projectId)
    {
        return await _unitOfWork.ElementRepository.GetElementListForGarden(projectId);
    }
}
