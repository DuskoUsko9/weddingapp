using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IScheduleRepository
{
    Task<IReadOnlyList<ScheduleItem>> GetAllAsync(CancellationToken ct = default);
    Task<ScheduleItem?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(ScheduleItem item, CancellationToken ct = default);
    Task UpdateAsync(ScheduleItem item, CancellationToken ct = default);
    Task DeleteAsync(ScheduleItem item, CancellationToken ct = default);
}
