using FluentValidation;
using MediatR;
using WeddingApp.Application.Auth.DTOs;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Auth.Commands;

public record ConfirmGuestCommand(Guid GuestId) : IRequest<LoginResult>;

public class ConfirmGuestCommandValidator : AbstractValidator<ConfirmGuestCommand>
{
    public ConfirmGuestCommandValidator()
    {
        RuleFor(x => x.GuestId).NotEmpty().WithMessage("Neplatný hosť.");
    }
}

public class ConfirmGuestCommandHandler : IRequestHandler<ConfirmGuestCommand, LoginResult>
{
    private readonly IGuestRepository _guests;
    private readonly IJwtService _jwt;

    public ConfirmGuestCommandHandler(IGuestRepository guests, IJwtService jwt)
    {
        _guests = guests;
        _jwt = jwt;
    }

    public async Task<LoginResult> Handle(ConfirmGuestCommand request, CancellationToken ct)
    {
        var guest = await _guests.GetByIdAsync(request.GuestId, ct);
        if (guest is null) return LoginResult.NotFound();

        var token = _jwt.GenerateToken(guest.Id, guest.FullName, UserRole.Guest);
        return LoginResult.Token(token, UserRole.Guest, guest.Id, guest.FullName);
    }
}
