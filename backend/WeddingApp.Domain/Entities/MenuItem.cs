using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class MenuItem : BaseEntity
{
    public Guid SectionId { get; set; }
    public MenuSection Section { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}
