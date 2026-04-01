using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Schedule.Commands;
using WeddingApp.Application.Schedule.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class ScheduleController : BaseController
{
    private readonly IMediator _mediator;

    public ScheduleController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetScheduleQuery(), ct));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] ScheduleItemRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new CreateScheduleItemCommand(request.TimeLabel, request.TimeMinutes,
                request.Title, request.Description, request.Icon, request.DisplayOrder), ct);
        return StatusCode(201, new { data = result, error = (string?)null });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ScheduleItemRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateScheduleItemCommand(id, request.TimeLabel, request.TimeMinutes,
                request.Title, request.Description, request.Icon, request.DisplayOrder), ct);
        return OkOrNotFound(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _mediator.Send(new DeleteScheduleItemCommand(id), ct);
        return deleted ? NoContent() : NotFound(new { data = (object?)null, error = "Nenašlo sa." });
    }
}

public record ScheduleItemRequest(string TimeLabel, int TimeMinutes, string Title, string? Description, string? Icon, int DisplayOrder);
