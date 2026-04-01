using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IGuestRepository
{
    Task<IReadOnlyList<Guest>> SearchByNameAsync(string normalizedName, CancellationToken ct = default);
    Task<Guest?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Guest>> GetAllAsync(CancellationToken ct = default);
    Task<int> CountAsync(CancellationToken ct = default);
}
