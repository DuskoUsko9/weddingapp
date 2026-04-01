using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.LoveStory.Commands;
using WeddingApp.Application.LoveStory.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class LoveStoryController : BaseController
{
    private readonly IMediator _mediator;

    public LoveStoryController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetLoveStoryQuery(), ct));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] LoveStoryEventRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new CreateLoveStoryEventCommand(request.EventDate, request.Title, request.Description, request.DisplayOrder), ct);
        return StatusCode(201, new { data = result, error = (string?)null });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] LoveStoryEventRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateLoveStoryEventCommand(id, request.EventDate, request.Title, request.Description, request.DisplayOrder), ct);
        return OkOrNotFound(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _mediator.Send(new DeleteLoveStoryEventCommand(id), ct);
        return deleted ? NoContent() : NotFound(new { data = (object?)null, error = "Nenašlo sa." });
    }
}

public record LoveStoryEventRequest(string EventDate, string Title, string? Description, int DisplayOrder);
