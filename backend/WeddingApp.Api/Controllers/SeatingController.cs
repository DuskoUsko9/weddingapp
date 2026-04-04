using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Seating.Commands;
using WeddingApp.Application.Seating.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class SeatingController : BaseController
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public SeatingController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    /// <summary>Returns the seating assignment for the currently logged-in guest.</summary>
    [HttpGet("my")]
    public async Task<IActionResult> GetMy(CancellationToken ct)
    {
        if (_currentUser.GuestId is null)
            return ErrorResult("Zasadací plán je dostupný len pre hostí.", 403);

        var result = await _mediator.Send(new GetMySeatingQuery(_currentUser.GuestId.Value), ct);
        return OkData(result);
    }

    /// <summary>Returns all seating assignments (admin / MasterOfCeremony only).</summary>
    [HttpGet]
    [Authorize(Roles = "Admin,MasterOfCeremony")]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetAllSeatingQuery(), ct));

    /// <summary>Creates or updates a seating assignment (admin only).</summary>
    [HttpPut("{guestId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Upsert(Guid guestId, [FromBody] UpsertSeatingRequest body, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpsertSeatingCommand(guestId, body.TableNumber, body.TableName, body.SeatNote), ct);
        return result.IsSuccess ? OkData(result.Value) : ErrorResult(result.Error!);
    }

    /// <summary>Removes a seating assignment (admin only).</summary>
    [HttpDelete("{guestId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid guestId, CancellationToken ct)
    {
        var deleted = await _mediator.Send(new DeleteSeatingCommand(guestId), ct);
        return deleted ? NoContent() : NotFound(new { data = (object?)null, error = "Nenašlo sa." });
    }
}

public record UpsertSeatingRequest(int TableNumber, string? TableName, string? SeatNote);
