using MediatR;
using WeddingApp.Application.BingoProgress.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.BingoProgress.Queries;

public record GetMyBingoProgressQuery(Guid GuestId) : IRequest<IReadOnlyList<BingoChallengeWithProgressDto>>;

public class GetMyBingoProgressQueryHandler
    : IRequestHandler<GetMyBingoProgressQuery, IReadOnlyList<BingoChallengeWithProgressDto>>
{
    private readonly IBingoChallengeRepository _challengeRepo;
    private readonly IGuestBingoProgressRepository _progressRepo;

    public GetMyBingoProgressQueryHandler(
        IBingoChallengeRepository challengeRepo,
        IGuestBingoProgressRepository progressRepo)
    {
        _challengeRepo = challengeRepo;
        _progressRepo = progressRepo;
    }

    public async Task<IReadOnlyList<BingoChallengeWithProgressDto>> Handle(
        GetMyBingoProgressQuery request, CancellationToken ct)
    {
        var challenges = await _challengeRepo.GetAllAsync(ct);
        var progress = await _progressRepo.GetByGuestIdAsync(request.GuestId, ct);
        var progressMap = progress.ToDictionary(p => p.ChallengeId);

        return challenges
            .Where(c => c.IsActive)
            .Select(c =>
            {
                var completed = progressMap.TryGetValue(c.Id, out var p);
                return new BingoChallengeWithProgressDto(
                    c.Id, c.Title, c.Description, c.DisplayOrder,
                    completed, p?.PhotoUrl, p?.CompletedAt);
            })
            .OrderBy(c => c.DisplayOrder)
            .ToList();
    }
}
