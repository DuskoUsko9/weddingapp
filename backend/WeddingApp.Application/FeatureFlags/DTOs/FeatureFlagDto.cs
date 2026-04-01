namespace WeddingApp.Application.FeatureFlags.DTOs;

public record FeatureFlagDto(
    Guid Id,
    string Key,
    string DisplayName,
    bool IsEnabled,
    bool IsManuallyEnabled,
    bool IsManuallyDisabled,
    DateTime? AvailableFrom,
    DateTime? AvailableUntil);
