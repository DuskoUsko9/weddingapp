using WeddingApp.Domain.Common;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Domain.Entities;

public class QuestionnaireResponse : BaseEntity
{
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; } = null!;
    public AlcoholPreference AlcoholPreference { get; set; }
    public bool HasAllergy { get; set; }
    public string? AllergyNotes { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
