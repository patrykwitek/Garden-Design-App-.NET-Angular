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
}
