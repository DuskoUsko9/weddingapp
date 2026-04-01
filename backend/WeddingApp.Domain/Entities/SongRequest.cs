using WeddingApp.Domain.Common;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Domain.Entities;

public class SongRequest : BaseEntity
{
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; } = null!;
    public string SongName { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public string? Dedication { get; set; } // max 120 chars
    public SongRequestStatus Status { get; set; } = SongRequestStatus.Pending;
}
