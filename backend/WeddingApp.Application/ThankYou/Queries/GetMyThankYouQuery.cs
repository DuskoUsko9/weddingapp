using MediatR;
using WeddingApp.Application.ThankYou.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.ThankYou.Queries;

public record GetMyThankYouQuery(Guid GuestId) : IRequest<ThankYouDto?>;

public class GetMyThankYouQueryHandler : IRequestHandler<GetMyThankYouQuery, ThankYouDto?>
{
    private readonly IThankYouMessageRepository _repo;

    public GetMyThankYouQueryHandler(IThankYouMessageRepository repo) => _repo = repo;

    public async Task<ThankYouDto?> Handle(GetMyThankYouQuery request, CancellationToken ct)
    {
        var msg = await _repo.GetByGuestIdAsync(request.GuestId, ct);
        if (msg is null) return null;
        return new ThankYouDto(msg.GuestId, msg.Guest?.FullName ?? string.Empty, msg.Message, msg.PhotoUrl);
    }
}
