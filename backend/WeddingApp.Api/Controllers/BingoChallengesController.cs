using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.BingoChallenges.Commands;
using WeddingApp.Application.BingoChallenges.Queries;
using WeddingApp.Application.BingoProgress.Commands;
using WeddingApp.Application.BingoProgress.Queries;
using WeddingApp.Application.Common.Interfaces;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class BingoChallengesController : BaseController
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public BingoChallengesController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetBingoChallengesQuery(), ct));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] BingoChallengeRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new CreateBingoChallengeCommand(request.Title, request.Description, request.DisplayOrder, request.IsActive), ct);
        return StatusCode(201, new { data = result, error = (string?)null });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] BingoChallengeRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateBingoChallengeCommand(id, request.Title, request.Description, request.DisplayOrder, request.IsActive), ct);
        return OkOrNotFound(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _mediator.Send(new DeleteBingoChallengeCommand(id), ct);
        return deleted ? NoContent() : NotFound(new { data = (object?)null, error = "Nenašlo sa." });
    }

    // ── Guest progress endpoints ────────────────────────────────────

    [HttpGet("progress")]
    public async Task<IActionResult> GetProgress(CancellationToken ct)
    {
        if (_currentUser.GuestId is null)
            return ErrorResult("Bingo je dostupné len pre hostí.", 403);

        var result = await _mediator.Send(new GetMyBingoProgressQuery(_currentUser.GuestId.Value), ct);
        return OkData(result);
    }

    [HttpPost("{id}/complete")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Complete(Guid id, IFormFile? photo, CancellationToken ct)
    {
        if (_currentUser.GuestId is null)
            return ErrorResult("Bingo je dostupné len pre hostí.", 403);

        Stream? stream = null;
        string? fileName = null;
        string? contentType = null;

        if (photo is { Length: > 0 })
        {
            stream = photo.OpenReadStream();
            fileName = photo.FileName;
            contentType = photo.ContentType;
        }

        var result = await _mediator.Send(
            new CompleteBingoChallengeCommand(_currentUser.GuestId.Value, id, stream, fileName, contentType), ct);

        if (stream is not null) await stream.DisposeAsync();

        return result.IsSuccess
            ? StatusCode(201, new { data = result.Value, error = (string?)null })
            : ErrorResult(result.Error!);
    }
}

public record BingoChallengeRequest(string Title, string? Description, int DisplayOrder, bool IsActive);
