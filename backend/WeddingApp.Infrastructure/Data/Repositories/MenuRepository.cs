using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Infrastructure.Data.Repositories;

public class MenuRepository : IMenuRepository
{
    private readonly WeddingAppDbContext _db;

    public MenuRepository(WeddingAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<MenuSection>> GetAllSectionsWithItemsAsync(CancellationToken ct = default) =>
        await _db.MenuSections
            .Include(s => s.Items.OrderBy(i => i.DisplayOrder))
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync(ct);

    public async Task<MenuSection?> GetSectionByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.MenuSections.Include(s => s.Items).FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<MenuItem?> GetItemByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.MenuItems.FindAsync([id], ct);

    public async Task AddSectionAsync(MenuSection section, CancellationToken ct = default)
    {
        await _db.MenuSections.AddAsync(section, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task AddItemAsync(MenuItem item, CancellationToken ct = default)
    {
        await _db.MenuItems.AddAsync(item, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateSectionAsync(MenuSection section, CancellationToken ct = default)
    {
        _db.MenuSections.Update(section);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateItemAsync(MenuItem item, CancellationToken ct = default)
    {
        _db.MenuItems.Update(item);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteSectionAsync(MenuSection section, CancellationToken ct = default)
    {
        _db.MenuSections.Remove(section);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteItemAsync(MenuItem item, CancellationToken ct = default)
    {
        _db.MenuItems.Remove(item);
        await _db.SaveChangesAsync(ct);
    }
}
