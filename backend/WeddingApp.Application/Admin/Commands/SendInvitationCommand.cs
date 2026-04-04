using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Common.Models;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Admin.Commands;

public record SendInvitationCommand(Guid GuestId) : IRequest<Result>;

public class SendInvitationCommandHandler : IRequestHandler<SendInvitationCommand, Result>
{
    private readonly IGuestRepository _guests;
    private readonly IEmailService _email;
    private readonly IInvitationLinkBuilder _linkBuilder;

    public SendInvitationCommandHandler(
        IGuestRepository guests,
        IEmailService email,
        IInvitationLinkBuilder linkBuilder)
    {
        _guests = guests;
        _email = email;
        _linkBuilder = linkBuilder;
    }

    public async Task<Result> Handle(SendInvitationCommand request, CancellationToken ct)
    {
        var guest = await _guests.GetByIdAsync(request.GuestId, ct);
        if (guest is null)
            return Result.Failure("Hosť nenájdený.");

        if (string.IsNullOrWhiteSpace(guest.Email))
            return Result.Failure("Hosť nemá nastavený email.");

        var magicLink = _linkBuilder.Build(guest.InvitationToken);
        await _email.SendInvitationAsync(guest.Email, guest.FullName, magicLink, ct);

        guest.InvitationSentAt = DateTimeOffset.UtcNow;
        await _guests.UpdateAsync(guest, ct);

        return Result.Success();
    }
}
