using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class MenuSection : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public ICollection<MenuItem> Items { get; set; } = new List<MenuItem>();
}
