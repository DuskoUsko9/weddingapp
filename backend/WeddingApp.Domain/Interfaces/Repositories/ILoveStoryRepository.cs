using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface ILoveStoryRepository
{
    Task<IReadOnlyList<LoveStoryEvent>> GetAllAsync(CancellationToken ct = default);
    Task<LoveStoryEvent?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(LoveStoryEvent loveStoryEvent, CancellationToken ct = default);
    Task UpdateAsync(LoveStoryEvent loveStoryEvent, CancellationToken ct = default);
    Task DeleteAsync(LoveStoryEvent loveStoryEvent, CancellationToken ct = default);
}
