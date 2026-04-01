using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class SongRequestRepository : ISongRequestRepository
{
    private readonly WeddingAppDbContext _db;

    public SongRequestRepository(WeddingAppDbContext db) => _db = db;

    public async Task<SongRequest?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.SongRequests.Include(s => s.Guest).FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<IReadOnlyList<SongRequest>> GetAllAsync(SongRequestStatus? status = null, CancellationToken ct = default)
    {
        var query = _db.SongRequests.Include(s => s.Guest).AsQueryable();
        if (status.HasValue) query = query.Where(s => s.Status == status.Value);
        return await query.OrderByDescending(s => s.CreatedAt).ToListAsync(ct);
    }

    public async Task<IReadOnlyList<SongRequest>> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default) =>
        await _db.SongRequests
            .Include(s => s.Guest)
            .Where(s => s.GuestId == guestId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(ct);

    public async Task<int> CountAsync(CancellationToken ct = default) =>
        await _db.SongRequests.CountAsync(ct);

    public async Task AddAsync(SongRequest request, CancellationToken ct = default)
    {
        await _db.SongRequests.AddAsync(request, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(SongRequest request, CancellationToken ct = default)
    {
        _db.SongRequests.Update(request);
        await _db.SaveChangesAsync(ct);
    }
}
