using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IStaticContentRepository
{
    Task<StaticContent?> GetByKeyAsync(string key, CancellationToken ct = default);
    Task UpdateAsync(StaticContent content, CancellationToken ct = default);
}
