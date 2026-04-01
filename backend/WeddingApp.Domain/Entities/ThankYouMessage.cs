using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

// Phase 3 — personalized thank-you per guest after wedding
public class ThankYouMessage : BaseEntity
{
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; } = null!;
    public string Message { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; } // Azure Blob URL
}
