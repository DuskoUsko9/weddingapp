using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Menu.Commands;
using WeddingApp.Application.Menu.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class MenuController : BaseController
{
    private readonly IMediator _mediator;

    public MenuController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetMenu(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetMenuQuery(), ct));

    // --- Sections ---

    [HttpPost("sections")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateSection([FromBody] MenuSectionRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateMenuSectionCommand(request.Name, request.DisplayOrder), ct);
        return StatusCode(201, new { data = result, error = (string?)null });
    }

    [HttpPut("sections/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSection(Guid id, [FromBody] MenuSectionRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateMenuSectionCommand(id, request.Name, request.DisplayOrder), ct);
        return OkOrNotFound(result);
    }

    [HttpDelete("sections/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSection(Guid id, CancellationToken ct)
    {
        var deleted = await _mediator.Send(new DeleteMenuSectionCommand(id), ct);
        return deleted ? NoContent() : NotFound(new { data = (object?)null, error = "Nenašlo sa." });
    }

    // --- Items ---

    [HttpPost("sections/{sectionId}/items")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateItem(Guid sectionId, [FromBody] MenuItemRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new CreateMenuItemCommand(sectionId, request.Name, request.Description, request.DisplayOrder), ct);
        if (result is null)
            return NotFound(new { data = (object?)null, error = "Sekcia nenájdená." });
        return StatusCode(201, new { data = result, error = (string?)null });
    }

    [HttpPut("items/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateItem(Guid id, [FromBody] MenuItemRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateMenuItemCommand(id, request.Name, request.Description, request.DisplayOrder), ct);
        return OkOrNotFound(result);
    }

    [HttpDelete("items/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteItem(Guid id, CancellationToken ct)
    {
        var deleted = await _mediator.Send(new DeleteMenuItemCommand(id), ct);
        return deleted ? NoContent() : NotFound(new { data = (object?)null, error = "Nenašlo sa." });
    }
}

public record MenuSectionRequest(string Name, int DisplayOrder);
public record MenuItemRequest(string Name, string? Description, int DisplayOrder);
