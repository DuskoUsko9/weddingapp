using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IFeatureFlagRepository
{
    Task<IReadOnlyList<FeatureFlag>> GetAllAsync(CancellationToken ct = default);
    Task<FeatureFlag?> GetByKeyAsync(string key, CancellationToken ct = default);
    Task UpdateAsync(FeatureFlag flag, CancellationToken ct = default);
}
