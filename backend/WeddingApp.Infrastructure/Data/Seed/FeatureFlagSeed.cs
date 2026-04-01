using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class FeatureFlagSeed
{
    // All times in UTC. Slovakia is CEST (UTC+2) in September.
    // Wedding day start:    2026-09-04 22:00 UTC = 2026-09-05 00:00 CEST
    // Gallery unlock:       2026-09-06 06:00 UTC = 2026-09-06 08:00 CEST
    // Questionnaire closes: 2026-08-01 00:00 UTC = 2026-08-01 02:00 CEST

    public static IEnumerable<FeatureFlag> GetFeatureFlags() =>
    [
        // Always-on features (manually enabled, no time restriction)
        F("wedding_info",  "Svadobné info",         manuallyEnabled: true),
        F("schedule",      "Program",                manuallyEnabled: true),
        F("menu",          "Menu",                   manuallyEnabled: true),
        F("parking",       "Parkovanie",             manuallyEnabled: true),
        F("accommodation", "Ubytovanie",             manuallyEnabled: true),
        F("playlist",      "Playlist pre DJ",        manuallyEnabled: true),
        F("love_story",    "Príbeh lásky",           manuallyEnabled: true),

        // Time-locked features
        F("questionnaire", "Dotazník",
            availableFrom:  new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            availableUntil: new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)),

        F("seating",       "Stolovanie",
            availableFrom:  new DateTime(2026, 9, 4, 22, 0, 0, DateTimeKind.Utc)),

        F("photo_upload",  "Nahrávanie fotiek",
            availableFrom:  new DateTime(2026, 9, 4, 22, 0, 0, DateTimeKind.Utc)),

        F("photo_bingo",   "Foto Bingo",
            availableFrom:  new DateTime(2026, 9, 4, 22, 0, 0, DateTimeKind.Utc)),

        F("gallery",       "Galéria",
            availableFrom:  new DateTime(2026, 9, 6, 6, 0, 0, DateTimeKind.Utc)),

        F("thank_you",     "Poďakovanie",
            availableFrom:  new DateTime(2026, 9, 6, 6, 0, 0, DateTimeKind.Utc)),

        // Phase 2 — disabled until content is ready
        F("cocktails", "Kokteily", manuallyDisabled: true),
    ];

    private static FeatureFlag F(
        string key,
        string displayName,
        bool manuallyEnabled = false,
        bool manuallyDisabled = false,
        DateTime? availableFrom = null,
        DateTime? availableUntil = null) => new()
    {
        Key = key,
        DisplayName = displayName,
        IsManuallyEnabled = manuallyEnabled,
        IsManuallyDisabled = manuallyDisabled,
        AvailableFrom = availableFrom,
        AvailableUntil = availableUntil,
        RolesAllowed = [],
    };
}
