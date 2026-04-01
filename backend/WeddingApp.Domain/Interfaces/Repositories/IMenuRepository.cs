using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IMenuRepository
{
    Task<IReadOnlyList<MenuSection>> GetAllSectionsWithItemsAsync(CancellationToken ct = default);
    Task<MenuSection?> GetSectionByIdAsync(Guid id, CancellationToken ct = default);
    Task<MenuItem?> GetItemByIdAsync(Guid id, CancellationToken ct = default);
    Task AddSectionAsync(MenuSection section, CancellationToken ct = default);
    Task AddItemAsync(MenuItem item, CancellationToken ct = default);
    Task UpdateSectionAsync(MenuSection section, CancellationToken ct = default);
    Task UpdateItemAsync(MenuItem item, CancellationToken ct = default);
    Task DeleteSectionAsync(MenuSection section, CancellationToken ct = default);
    Task DeleteItemAsync(MenuItem item, CancellationToken ct = default);
}
