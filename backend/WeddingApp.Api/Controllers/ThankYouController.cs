using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.ThankYou.Commands;
using WeddingApp.Application.ThankYou.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class ThankYouController : BaseController
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public ThankYouController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    /// <summary>Returns the personalized thank-you message for the current guest.</summary>
    [HttpGet("my")]
    public async Task<IActionResult> GetMy(CancellationToken ct)
    {
        if (_currentUser.GuestId is null)
            return ErrorResult("Poďakovanie je dostupné len pre hostí.", 403);

        var result = await _mediator.Send(new GetMyThankYouQuery(_currentUser.GuestId.Value), ct);
        return OkData(result);
    }

    /// <summary>Returns all thank-you messages (admin only).</summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetAllThankYouQuery(), ct));

    /// <summary>Creates or updates a thank-you message for a guest (admin only).</summary>
    [HttpPut("{guestId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Upsert(Guid guestId, [FromBody] UpsertThankYouRequest body, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpsertThankYouMessageCommand(guestId, body.Message, body.PhotoUrl), ct);
        return result.IsSuccess ? OkData(result.Value) : ErrorResult(result.Error!);
    }

    /// <summary>Deletes a thank-you message (admin only).</summary>
    [HttpDelete("{guestId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid guestId, CancellationToken ct)
    {
        var deleted = await _mediator.Send(new DeleteThankYouMessageCommand(guestId), ct);
        return deleted ? NoContent() : NotFound(new { data = (object?)null, error = "Nenašlo sa." });
    }
}

public record UpsertThankYouRequest(string Message, string? PhotoUrl);
