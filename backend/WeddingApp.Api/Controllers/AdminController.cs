using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Admin.Commands;
using WeddingApp.Application.Admin.Queries;
using WeddingApp.Application.Guests.Queries;
using WeddingApp.Application.Common.Interfaces;

namespace WeddingApp.Api.Controllers;

[Authorize(Roles = "Admin,MasterOfCeremony")]
public class AdminController : BaseController
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator) => _mediator = mediator;

    [HttpGet("stats")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetStats(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetAdminStatsQuery(), ct));

    [HttpGet("guests")]
    public async Task<IActionResult> GetGuests([FromQuery] string? search, CancellationToken ct) =>
        OkData(await _mediator.Send(new GetGuestsQuery(search), ct));

    // ── Invitations ────────────────────────────────────────────────────────

    [HttpGet("invitations")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetInvitationStatus(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetInvitationStatusQuery(), ct));

    [HttpPost("invitations/{guestId:guid}/send")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> SendInvitation(Guid guestId, CancellationToken ct)
    {
        var result = await _mediator.Send(new SendInvitationCommand(guestId), ct);
        return result.IsSuccess
            ? OkData(new { message = "Pozvánka odoslaná." })
            : ErrorResult(result.Error!);
    }

    [HttpPost("invitations/send-all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> SendAllInvitations(
        [FromBody] SendAllInvitationsRequest body,
        CancellationToken ct)
    {
        var result = await _mediator.Send(new SendAllInvitationsCommand(body.ResendAlreadySent), ct);
        return OkData(new
        {
            sent = result.Sent,
            skipped = result.Skipped,
            errors = result.Errors,
        });
    }

    [HttpPatch("guests/{guestId:guid}/email")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGuestEmail(
        Guid guestId,
        [FromBody] UpdateGuestEmailRequest body,
        CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateGuestEmailCommand(guestId, body.Email), ct);
        return result.IsSuccess
            ? OkData(new { message = "Email aktualizovaný." })
            : ErrorResult(result.Error!);
    }

    // ── Impersonation ───────────────────────────────────────────────────────

    [HttpPost("impersonate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Impersonate(
        [FromBody] ImpersonateRequest body,
        CancellationToken ct)
    {
        var result = await _mediator.Send(new ImpersonateCommand(body.GuestId, body.Role), ct);
        return result.IsSuccess
            ? OkData(new { token = result.Value })
            : ErrorResult(result.Error!);
    }
}

public record ImpersonateRequest(Guid? GuestId, string? Role);
public record SendAllInvitationsRequest(bool ResendAlreadySent = false);
public record UpdateGuestEmailRequest(string? Email);
