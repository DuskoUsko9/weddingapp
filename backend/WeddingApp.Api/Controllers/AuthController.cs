using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Auth.Commands;
using WeddingApp.Application.Auth.DTOs;

namespace WeddingApp.Api.Controllers;

public class AuthController : BaseController
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator) => _mediator = mediator;

    /// <summary>Login by name or special token (no password).</summary>
    [HttpPost("login")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new LoginCommand(request.Name), ct);

        return result.Type switch
        {
            LoginResultType.Token => OkData(new
            {
                type = "token",
                token = result.JwtToken,
                role = result.Role?.ToString(),
                guestId = result.GuestId,
                guestName = result.GuestName,
            }),
            LoginResultType.Disambiguation => OkData(new
            {
                type = "disambiguation",
                matches = result.Matches,
            }),
            LoginResultType.NotFound => ErrorResult(
                "Nenašli sme ťa v zozname hostí. Skontroluj celé meno alebo kontaktuj organizátora.", 404),
            _ => ErrorResult("Neočakávaná chyba.", 500),
        };
    }

    /// <summary>Confirm identity after disambiguation.</summary>
    [HttpPost("confirm")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Confirm([FromBody] ConfirmRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new ConfirmGuestCommand(request.GuestId), ct);

        return result.Type switch
        {
            LoginResultType.Token => OkData(new
            {
                token = result.JwtToken,
                role = result.Role?.ToString(),
                guestId = result.GuestId,
                guestName = result.GuestName,
            }),
            _ => ErrorResult("Hosť nenájdený.", 404),
        };
    }
}

public record LoginRequest(string Name);
public record ConfirmRequest(Guid GuestId);
