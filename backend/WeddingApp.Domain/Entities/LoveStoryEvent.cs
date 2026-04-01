using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class LoveStoryEvent : BaseEntity
{
    public DateOnly EventDate { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? PhotoUrl { get; set; } // Azure Blob URL (Phase 2)
    public int DisplayOrder { get; set; }
}
