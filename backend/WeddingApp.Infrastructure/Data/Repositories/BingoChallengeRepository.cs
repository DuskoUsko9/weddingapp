using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class BingoChallengeRepository : IBingoChallengeRepository
{
    private readonly WeddingAppDbContext _db;

    public BingoChallengeRepository(WeddingAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<BingoChallenge>> GetAllAsync(CancellationToken ct = default) =>
        await _db.BingoChallenges
            .OrderBy(b => b.DisplayOrder)
            .ToListAsync(ct);

    public async Task<BingoChallenge?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.BingoChallenges.FindAsync([id], ct);

    public async Task AddAsync(BingoChallenge challenge, CancellationToken ct = default)
    {
        await _db.BingoChallenges.AddAsync(challenge, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(BingoChallenge challenge, CancellationToken ct = default)
    {
        _db.BingoChallenges.Update(challenge);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(BingoChallenge challenge, CancellationToken ct = default)
    {
        _db.BingoChallenges.Remove(challenge);
        await _db.SaveChangesAsync(ct);
    }
}
