using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class GuestBingoProgress : BaseEntity
{
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; } = null!;
    public Guid ChallengeId { get; set; }
    public BingoChallenge Challenge { get; set; } = null!;
    public string? PhotoUrl { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
}
