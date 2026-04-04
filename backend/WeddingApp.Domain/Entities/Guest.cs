using WeddingApp.Domain.Common;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Domain.Entities;

public class Guest : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty; // unaccent + lowercase for search
    public GuestSide Side { get; set; } = GuestSide.Both;
    public bool IsChild { get; set; }
    public int? AgeAtWedding { get; set; }
    public AlcoholPreference AlcoholDefault { get; set; } = AlcoholPreference.Drinks;
    public string GuestType { get; set; } = "Standard"; // Standard | After20
    public GuestCategory Category { get; set; } = GuestCategory.Family;
    public bool IsConfirmed { get; set; } = true;
    public string? Email { get; set; }
    public Guid InvitationToken { get; set; } = Guid.NewGuid();
    public DateTimeOffset? InvitationSentAt { get; set; }

    // Navigation properties
    public QuestionnaireResponse? QuestionnaireResponse { get; set; }
    public ICollection<SongRequest> SongRequests { get; set; } = new List<SongRequest>();
    public ThankYouMessage? ThankYouMessage { get; set; }
    public ICollection<GuestPhoto> Photos { get; set; } = new List<GuestPhoto>();
    public ICollection<GuestBingoProgress> BingoProgress { get; set; } = new List<GuestBingoProgress>();
    public SeatingAssignment? SeatingAssignment { get; set; }
}
