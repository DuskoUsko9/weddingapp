using MediatR;
using WeddingApp.Application.BingoChallenges.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.BingoChallenges.Queries;

public record GetBingoChallengesQuery : IRequest<IReadOnlyList<BingoChallengeDto>>;

public class GetBingoChallengesQueryHandler : IRequestHandler<GetBingoChallengesQuery, IReadOnlyList<BingoChallengeDto>>
{
    private readonly IBingoChallengeRepository _repo;

    public GetBingoChallengesQueryHandler(IBingoChallengeRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<BingoChallengeDto>> Handle(GetBingoChallengesQuery request, CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return items.Select(b => new BingoChallengeDto(b.Id, b.Title, b.Description, b.DisplayOrder, b.IsActive)).ToList();
    }
}
