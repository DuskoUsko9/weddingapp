using MediatR;
using WeddingApp.Application.ThankYou.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.ThankYou.Queries;

public record GetAllThankYouQuery : IRequest<IReadOnlyList<ThankYouDto>>;

public class GetAllThankYouQueryHandler : IRequestHandler<GetAllThankYouQuery, IReadOnlyList<ThankYouDto>>
{
    private readonly IThankYouMessageRepository _repo;

    public GetAllThankYouQueryHandler(IThankYouMessageRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<ThankYouDto>> Handle(GetAllThankYouQuery request, CancellationToken ct)
    {
        var all = await _repo.GetAllAsync(ct);
        return all
            .Select(m => new ThankYouDto(m.GuestId, m.Guest?.FullName ?? string.Empty, m.Message, m.PhotoUrl))
            .OrderBy(m => m.GuestName)
            .ToList();
    }
}
