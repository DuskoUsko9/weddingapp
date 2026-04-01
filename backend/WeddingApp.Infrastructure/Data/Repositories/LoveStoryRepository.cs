using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class LoveStoryRepository : ILoveStoryRepository
{
    private readonly WeddingAppDbContext _db;

    public LoveStoryRepository(WeddingAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<LoveStoryEvent>> GetAllAsync(CancellationToken ct = default) =>
        await _db.LoveStoryEvents
            .OrderBy(e => e.EventDate).ThenBy(e => e.DisplayOrder)
            .ToListAsync(ct);

    public async Task<LoveStoryEvent?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.LoveStoryEvents.FindAsync([id], ct);

    public async Task AddAsync(LoveStoryEvent loveStoryEvent, CancellationToken ct = default)
    {
        await _db.LoveStoryEvents.AddAsync(loveStoryEvent, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(LoveStoryEvent loveStoryEvent, CancellationToken ct = default)
    {
        _db.LoveStoryEvents.Update(loveStoryEvent);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(LoveStoryEvent loveStoryEvent, CancellationToken ct = default)
    {
        _db.LoveStoryEvents.Remove(loveStoryEvent);
        await _db.SaveChangesAsync(ct);
    }
}
