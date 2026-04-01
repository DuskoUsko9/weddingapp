using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.SongRequests.Commands;
using WeddingApp.Application.SongRequests.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class SongRequestsController : BaseController
{
    private readonly IMediator _mediator;

    public SongRequestsController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSongRequestRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new CreateSongRequestCommand(request.SongName, request.Artist, request.Dedication), ct);
        return StatusCode(201, new { data = result, error = (string?)null });
    }

    [HttpGet]
    [Authorize(Roles = "DJ,Admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? status, CancellationToken ct) =>
        OkData(await _mediator.Send(new GetSongRequestsQuery(status), ct));

    [HttpGet("my")]
    public async Task<IActionResult> GetMy(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetMySongRequestsQuery(), ct));

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "DJ,Admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateSongRequestStatusCommand(id, request.Status), ct);
        return OkOrNotFound(result);
    }
}

public record CreateSongRequestRequest(string SongName, string? Artist, string? Dedication);
public record UpdateStatusRequest(string Status);
