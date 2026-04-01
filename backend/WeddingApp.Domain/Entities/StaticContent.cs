using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class StaticContent : BaseEntity
{
    public string Key { get; set; } = string.Empty;   // "parking" | "accommodation"
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Metadata { get; set; }              // JSON string
}
