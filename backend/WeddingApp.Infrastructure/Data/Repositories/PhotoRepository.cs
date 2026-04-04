using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class PhotoRepository : IPhotoRepository
{
    private readonly WeddingAppDbContext _db;

    public PhotoRepository(WeddingAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<GuestPhoto>> GetAllAsync(CancellationToken ct = default) =>
        await _db.GuestPhotos
            .Include(p => p.Guest)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);

    public async Task<GuestPhoto?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.GuestPhotos.Include(p => p.Guest).FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task AddAsync(GuestPhoto photo, CancellationToken ct = default)
    {
        await _db.GuestPhotos.AddAsync(photo, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(GuestPhoto photo, CancellationToken ct = default)
    {
        _db.GuestPhotos.Remove(photo);
        await _db.SaveChangesAsync(ct);
    }
}
