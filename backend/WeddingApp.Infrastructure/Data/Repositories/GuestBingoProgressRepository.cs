using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class GuestBingoProgressRepository : IGuestBingoProgressRepository
{
    private readonly WeddingAppDbContext _db;

    public GuestBingoProgressRepository(WeddingAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<GuestBingoProgress>> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default) =>
        await _db.GuestBingoProgress
            .Where(p => p.GuestId == guestId)
            .ToListAsync(ct);

    public async Task<GuestBingoProgress?> GetByGuestAndChallengeAsync(Guid guestId, Guid challengeId, CancellationToken ct = default) =>
        await _db.GuestBingoProgress
            .FirstOrDefaultAsync(p => p.GuestId == guestId && p.ChallengeId == challengeId, ct);

    public async Task AddAsync(GuestBingoProgress progress, CancellationToken ct = default)
    {
        await _db.GuestBingoProgress.AddAsync(progress, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(GuestBingoProgress progress, CancellationToken ct = default)
    {
        _db.GuestBingoProgress.Remove(progress);
        await _db.SaveChangesAsync(ct);
    }
}
