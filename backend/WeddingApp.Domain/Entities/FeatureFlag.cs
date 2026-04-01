using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class FeatureFlag : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public bool IsManuallyEnabled { get; set; }
    public bool IsManuallyDisabled { get; set; }
    public DateTime? AvailableFrom { get; set; }  // UTC
    public DateTime? AvailableUntil { get; set; } // UTC
    public string[] RolesAllowed { get; set; } = []; // empty = all roles

    public bool IsCurrentlyEnabled(DateTime utcNow)
    {
        if (IsManuallyDisabled) return false;
        if (IsManuallyEnabled) return true;
        if (AvailableFrom.HasValue && utcNow < AvailableFrom.Value) return false;
        if (AvailableUntil.HasValue && utcNow > AvailableUntil.Value) return false;
        return AvailableFrom.HasValue;
    }
}
