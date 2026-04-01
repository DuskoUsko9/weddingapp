using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface ISongRequestRepository
{
    Task<SongRequest?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<SongRequest>> GetAllAsync(SongRequestStatus? status = null, CancellationToken ct = default);
    Task<IReadOnlyList<SongRequest>> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default);
    Task<int> CountAsync(CancellationToken ct = default);
    Task AddAsync(SongRequest request, CancellationToken ct = default);
    Task UpdateAsync(SongRequest request, CancellationToken ct = default);
}
