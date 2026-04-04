using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class ThankYouMessageRepository : IThankYouMessageRepository
{
    private readonly WeddingAppDbContext _db;

    public ThankYouMessageRepository(WeddingAppDbContext db) => _db = db;

    public async Task<ThankYouMessage?> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default) =>
        await _db.ThankYouMessages
            .Include(m => m.Guest)
            .FirstOrDefaultAsync(m => m.GuestId == guestId, ct);

    public async Task<IReadOnlyList<ThankYouMessage>> GetAllAsync(CancellationToken ct = default) =>
        await _db.ThankYouMessages
            .Include(m => m.Guest)
            .ToListAsync(ct);

    public async Task AddAsync(ThankYouMessage message, CancellationToken ct = default)
    {
        await _db.ThankYouMessages.AddAsync(message, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ThankYouMessage message, CancellationToken ct = default)
    {
        _db.ThankYouMessages.Update(message);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(ThankYouMessage message, CancellationToken ct = default)
    {
        _db.ThankYouMessages.Remove(message);
        await _db.SaveChangesAsync(ct);
    }
}
