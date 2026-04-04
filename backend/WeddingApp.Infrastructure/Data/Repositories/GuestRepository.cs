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
        return await _db.Guests
            .Include(g => g.QuestionnaireResponse)
            .Where(g => g.IsConfirmed &&
                        EF.Functions.Like(g.NormalizedName, $"%{normalizedName}%"))
            .OrderBy(g => g.FullName)
            .ToListAsync(ct);
    }

    public async Task<Guest?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Guests
            .Include(g => g.QuestionnaireResponse)
            .FirstOrDefaultAsync(g => g.Id == id, ct);

    public async Task<Guest?> GetByInvitationTokenAsync(Guid token, CancellationToken ct = default) =>
        await _db.Guests.FirstOrDefaultAsync(g => g.InvitationToken == token, ct);

    public async Task<IReadOnlyList<Guest>> GetAllAsync(CancellationToken ct = default) =>
        await _db.Guests
            .Include(g => g.QuestionnaireResponse)
            .OrderBy(g => g.FullName)
            .ToListAsync(ct);

    public async Task<int> CountAsync(CancellationToken ct = default) =>
        await _db.Guests.CountAsync(ct);

    public async Task UpdateAsync(Guest guest, CancellationToken ct = default)
    {
        _db.Guests.Update(guest);
        await _db.SaveChangesAsync(ct);
    }
}
