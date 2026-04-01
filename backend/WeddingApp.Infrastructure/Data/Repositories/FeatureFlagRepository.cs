using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class FeatureFlagRepository : IFeatureFlagRepository
{
    private readonly WeddingAppDbContext _db;

    public FeatureFlagRepository(WeddingAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<FeatureFlag>> GetAllAsync(CancellationToken ct = default) =>
        await _db.FeatureFlags.OrderBy(f => f.Key).ToListAsync(ct);

    public async Task<FeatureFlag?> GetByKeyAsync(string key, CancellationToken ct = default) =>
        await _db.FeatureFlags.FirstOrDefaultAsync(f => f.Key == key, ct);

    public async Task UpdateAsync(FeatureFlag flag, CancellationToken ct = default)
    {
        _db.FeatureFlags.Update(flag);
        await _db.SaveChangesAsync(ct);
    }
}
