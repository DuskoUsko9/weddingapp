using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class SeatingRepository : ISeatingRepository
{
    private readonly WeddingAppDbContext _db;

    public SeatingRepository(WeddingAppDbContext db) => _db = db;

    public async Task<SeatingAssignment?> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default) =>
        await _db.SeatingAssignments
            .Include(s => s.Guest)
            .FirstOrDefaultAsync(s => s.GuestId == guestId, ct);

    public async Task<IReadOnlyList<SeatingAssignment>> GetByTableNumberAsync(int tableNumber, CancellationToken ct = default) =>
        await _db.SeatingAssignments
            .Include(s => s.Guest)
            .Where(s => s.TableNumber == tableNumber)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<SeatingAssignment>> GetAllAsync(CancellationToken ct = default) =>
        await _db.SeatingAssignments
            .Include(s => s.Guest)
            .ToListAsync(ct);

    public async Task AddAsync(SeatingAssignment assignment, CancellationToken ct = default)
    {
        await _db.SeatingAssignments.AddAsync(assignment, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(SeatingAssignment assignment, CancellationToken ct = default)
    {
        _db.SeatingAssignments.Update(assignment);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(SeatingAssignment assignment, CancellationToken ct = default)
    {
        _db.SeatingAssignments.Remove(assignment);
        await _db.SaveChangesAsync(ct);
    }
}
