using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class GuestPhoto : BaseEntity
{
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
}
