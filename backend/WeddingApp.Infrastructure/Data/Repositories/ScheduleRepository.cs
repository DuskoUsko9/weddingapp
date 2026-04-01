using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class ScheduleRepository : IScheduleRepository
{
    private readonly WeddingAppDbContext _db;

    public ScheduleRepository(WeddingAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<ScheduleItem>> GetAllAsync(CancellationToken ct = default) =>
        await _db.ScheduleItems
            .OrderBy(s => s.TimeMinutes).ThenBy(s => s.DisplayOrder)
            .ToListAsync(ct);

    public async Task<ScheduleItem?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.ScheduleItems.FindAsync([id], ct);

    public async Task AddAsync(ScheduleItem item, CancellationToken ct = default)
    {
        await _db.ScheduleItems.AddAsync(item, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ScheduleItem item, CancellationToken ct = default)
    {
        _db.ScheduleItems.Update(item);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(ScheduleItem item, CancellationToken ct = default)
    {
        _db.ScheduleItems.Remove(item);
        await _db.SaveChangesAsync(ct);
    }
}
