using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Services;

public class FeatureFlagService : IFeatureFlagService
{
    private readonly IFeatureFlagRepository _repo;

    public FeatureFlagService(IFeatureFlagRepository repo) => _repo = repo;

    public async Task<bool> IsEnabledAsync(string key, string? role = null, CancellationToken ct = default)
    {
        var flag = await _repo.GetByKeyAsync(key, ct);
        if (flag is null) return false;

        if (flag.RolesAllowed.Length > 0 && role is not null)
            if (!flag.RolesAllowed.Contains(role, StringComparer.OrdinalIgnoreCase))
                return false;

        return flag.IsCurrentlyEnabled(DateTime.UtcNow);
    }
}
