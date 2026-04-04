using MediatR;
using WeddingApp.Application.Auth.DTOs;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Auth.Commands;

public record MagicLoginCommand(Guid Token) : IRequest<LoginResult>;

public class MagicLoginCommandHandler : IRequestHandler<MagicLoginCommand, LoginResult>
{
    // Magic links expire the day after the wedding (2026-09-07 00:00 UTC)
    private static readonly DateTimeOffset LinkExpiry = new(2026, 9, 7, 0, 0, 0, TimeSpan.Zero);

    private readonly IGuestRepository _guests;
    private readonly IJwtService _jwt;

    public MagicLoginCommandHandler(IGuestRepository guests, IJwtService jwt)
    {
        _guests = guests;
        _jwt = jwt;
    }

    public async Task<LoginResult> Handle(MagicLoginCommand request, CancellationToken ct)
    {
        if (DateTimeOffset.UtcNow > LinkExpiry)
            return LoginResult.Error("Tento prihlasovací odkaz už vypršal.");

        var guest = await _guests.GetByInvitationTokenAsync(request.Token, ct);
        if (guest is null)
            return LoginResult.Error("Neplatný prihlasovací odkaz.");

        var jwt = _jwt.GenerateToken(guest.Id, guest.FullName, UserRole.Guest);
        return LoginResult.Token(jwt, UserRole.Guest, guest.Id, guest.FullName);
    }
}
