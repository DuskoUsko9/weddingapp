using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class QuestionnaireRepository : IQuestionnaireRepository
{
    private readonly WeddingAppDbContext _db;

    public QuestionnaireRepository(WeddingAppDbContext db) => _db = db;

    public async Task<QuestionnaireResponse?> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default) =>
        await _db.QuestionnaireResponses
            .Include(q => q.Guest)
            .FirstOrDefaultAsync(q => q.GuestId == guestId, ct);

    public async Task<IReadOnlyList<QuestionnaireResponse>> GetAllAsync(CancellationToken ct = default) =>
        await _db.QuestionnaireResponses
            .Include(q => q.Guest)
            .OrderBy(q => q.Guest.FullName)
            .ToListAsync(ct);

    public async Task<int> CountSubmittedAsync(CancellationToken ct = default) =>
        await _db.QuestionnaireResponses.CountAsync(ct);

    public async Task AddAsync(QuestionnaireResponse response, CancellationToken ct = default)
    {
        await _db.QuestionnaireResponses.AddAsync(response, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(QuestionnaireResponse response, CancellationToken ct = default)
    {
        _db.QuestionnaireResponses.Update(response);
        await _db.SaveChangesAsync(ct);
    }
}
