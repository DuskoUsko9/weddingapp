using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Common.Models;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Admin.Commands;

public record SendAllInvitationsCommand(bool ResendAlreadySent = false) : IRequest<SendAllInvitationsResult>;

public record SendAllInvitationsResult(int Sent, int Skipped, IReadOnlyList<string> Errors);

public class SendAllInvitationsCommandHandler : IRequestHandler<SendAllInvitationsCommand, SendAllInvitationsResult>
{
    private readonly IGuestRepository _guests;
    private readonly IEmailService _email;
    private readonly IInvitationLinkBuilder _linkBuilder;

    public SendAllInvitationsCommandHandler(
        IGuestRepository guests,
        IEmailService email,
        IInvitationLinkBuilder linkBuilder)
    {
        _guests = guests;
        _email = email;
        _linkBuilder = linkBuilder;
    }

    public async Task<SendAllInvitationsResult> Handle(SendAllInvitationsCommand request, CancellationToken ct)
    {
        var all = await _guests.GetAllAsync(ct);
        var eligible = all.Where(g =>
            !string.IsNullOrWhiteSpace(g.Email) &&
            (request.ResendAlreadySent || g.InvitationSentAt is null))
            .ToList();

        int sent = 0;
        int skipped = all.Count - eligible.Count;
        var errors = new List<string>();

        foreach (var guest in eligible)
        {
            try
            {
                var magicLink = _linkBuilder.Build(guest.InvitationToken);
                await _email.SendInvitationAsync(guest.Email!, guest.FullName, magicLink, ct);
                guest.InvitationSentAt = DateTimeOffset.UtcNow;
                await _guests.UpdateAsync(guest, ct);
                sent++;
            }
            catch (Exception ex)
            {
                errors.Add($"{guest.FullName}: {ex.Message}");
            }
        }

        return new SendAllInvitationsResult(sent, skipped, errors);
    }
}
