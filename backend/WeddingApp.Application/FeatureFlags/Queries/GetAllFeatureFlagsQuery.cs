using MediatR;
using WeddingApp.Application.FeatureFlags.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.FeatureFlags.Queries;

public record GetAllFeatureFlagsQuery : IRequest<IReadOnlyList<FeatureFlagDto>>;

public class GetAllFeatureFlagsQueryHandler : IRequestHandler<GetAllFeatureFlagsQuery, IReadOnlyList<FeatureFlagDto>>
{
    private readonly IFeatureFlagRepository _repo;

    public GetAllFeatureFlagsQueryHandler(IFeatureFlagRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<FeatureFlagDto>> Handle(GetAllFeatureFlagsQuery request, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var flags = await _repo.GetAllAsync(ct);
        return flags.Select(f => new FeatureFlagDto(
            f.Id, f.Key, f.DisplayName,
            f.IsCurrentlyEnabled(now),
            f.IsManuallyEnabled, f.IsManuallyDisabled,
            f.AvailableFrom, f.AvailableUntil)).ToList();
    }
}
