using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IPhotoRepository
{
    Task<IReadOnlyList<GuestPhoto>> GetAllAsync(CancellationToken ct = default);
    Task<GuestPhoto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(GuestPhoto photo, CancellationToken ct = default);
    Task DeleteAsync(GuestPhoto photo, CancellationToken ct = default);
}
