using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.FeatureFlags.Commands;
using WeddingApp.Application.FeatureFlags.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class FeatureFlagsController : BaseController
{
    private readonly IMediator _mediator;

    public FeatureFlagsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetAllFeatureFlagsQuery(), ct));

    [HttpPatch("{key}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string key, [FromBody] UpdateFeatureFlagRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateFeatureFlagCommand(key, request.IsManuallyEnabled, request.IsManuallyDisabled,
                                         request.AvailableFrom, request.AvailableUntil), ct);
        return OkOrNotFound(result);
    }
}

public record UpdateFeatureFlagRequest(
    bool? IsManuallyEnabled,
    bool? IsManuallyDisabled,
    DateTime? AvailableFrom,
    DateTime? AvailableUntil);
