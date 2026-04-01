using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class GuestRepository : IGuestRepository
{
    private readonly WeddingAppDbContext _db;

    public GuestRepository(WeddingAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<Guest>> SearchByNameAsync(string normalizedName, CancellationToken ct = default)
    {
        // Use EF.Functions.ILike for case-insensitive prefix/contains match
        // pg_trgm similarity requires raw SQL — use contains fallback for EF compatibility
        return await _db.Guests
            .Include(g => g.QuestionnaireResponse)
            .Where(g => g.IsConfirmed &&
                        EF.Functions.ILike(g.NormalizedName, $"%{normalizedName}%"))
            .OrderBy(g => g.FullName)
            .ToListAsync(ct);
    }

    public async Task<Guest?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Guests
            .Include(g => g.QuestionnaireResponse)
            .FirstOrDefaultAsync(g => g.Id == id, ct);

    public async Task<IReadOnlyList<Guest>> GetAllAsync(CancellationToken ct = default) =>
        await _db.Guests
            .Include(g => g.QuestionnaireResponse)
            .OrderBy(g => g.FullName)
            .ToListAsync(ct);

    public async Task<int> CountAsync(CancellationToken ct = default) =>
        await _db.Guests.CountAsync(ct);
}
