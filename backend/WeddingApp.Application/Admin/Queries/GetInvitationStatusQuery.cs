using MediatR;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Admin.Queries;

public record GuestInvitationStatusDto(
    Guid GuestId,
    string FullName,
    string? Email,
    bool InvitationSent,
    DateTimeOffset? InvitationSentAt);

public record GetInvitationStatusQuery : IRequest<IReadOnlyList<GuestInvitationStatusDto>>;

public class GetInvitationStatusQueryHandler
    : IRequestHandler<GetInvitationStatusQuery, IReadOnlyList<GuestInvitationStatusDto>>
{
    private readonly IGuestRepository _guests;

    public GetInvitationStatusQueryHandler(IGuestRepository guests) => _guests = guests;

    public async Task<IReadOnlyList<GuestInvitationStatusDto>> Handle(
        GetInvitationStatusQuery request,
        CancellationToken ct)
    {
        var guests = await _guests.GetAllAsync(ct);
        return guests
            .Select(g => new GuestInvitationStatusDto(
                g.Id,
                g.FullName,
                g.Email,
                g.InvitationSentAt.HasValue,
                g.InvitationSentAt))
            .OrderBy(g => g.FullName)
            .ToList();
    }
}
