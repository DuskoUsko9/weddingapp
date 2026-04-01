using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class StaticContentRepository : IStaticContentRepository
{
    private readonly WeddingAppDbContext _db;

    public StaticContentRepository(WeddingAppDbContext db) => _db = db;

    public async Task<StaticContent?> GetByKeyAsync(string key, CancellationToken ct = default) =>
        await _db.StaticContents.FirstOrDefaultAsync(s => s.Key == key, ct);

    public async Task UpdateAsync(StaticContent content, CancellationToken ct = default)
    {
        _db.StaticContents.Update(content);
        await _db.SaveChangesAsync(ct);
    }
}
