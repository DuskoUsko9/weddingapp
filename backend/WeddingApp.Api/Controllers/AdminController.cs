using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Admin.Queries;
using WeddingApp.Application.Guests.Queries;

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
}
