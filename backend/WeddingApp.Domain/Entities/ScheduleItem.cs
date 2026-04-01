using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class ScheduleItem : BaseEntity
{
    public string TimeLabel { get; set; } = string.Empty; // "15:30"
    public int TimeMinutes { get; set; }                  // 930 (for sorting)
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }                     // emoji
    public int DisplayOrder { get; set; }
}
