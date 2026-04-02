using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WeddingApp.Domain.Entities;
using WeddingApp.Infrastructure.Data;

namespace WeddingApp.Infrastructure.Data.Seed;

public class DataSeeder
{
    private readonly WeddingAppDbContext _db;
    private readonly ILogger<DataSeeder> _logger;

    public DataSeeder(WeddingAppDbContext db, ILogger<DataSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("Applying database migrations...");
        await _db.Database.MigrateAsync(ct);

        await SeedGuestsAsync(ct);
        await SeedFeatureFlagsAsync(ct);
        await SeedScheduleAsync(ct);
        await SeedMenuAsync(ct);
        await SeedStaticContentAsync(ct);
        await SeedLoveStoryAsync(ct);
        await SeedBingoChallengesAsync(ct);
        await SeedQuestionnaireResponsesAsync(ct);
        await SeedSongRequestsAsync(ct);

        _logger.LogInformation("Database seeding complete.");
    }

    private async Task SeedGuestsAsync(CancellationToken ct)
    {
        if (await _db.Guests.AnyAsync(ct))
        {
            _logger.LogInformation("Guests already seeded, skipping.");
            return;
        }
        var guests = GuestSeed.GetGuests().ToList();
        await _db.Guests.AddRangeAsync(guests, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} guests.", guests.Count);
    }

    private async Task SeedFeatureFlagsAsync(CancellationToken ct)
    {
        if (await _db.FeatureFlags.AnyAsync(ct))
        {
            _logger.LogInformation("Feature flags already seeded, skipping.");
            return;
        }
        var flags = FeatureFlagSeed.GetFeatureFlags().ToList();
        await _db.FeatureFlags.AddRangeAsync(flags, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} feature flags.", flags.Count);
    }

    private async Task SeedScheduleAsync(CancellationToken ct)
    {
        if (await _db.ScheduleItems.AnyAsync(ct)) return;
        var items = ScheduleSeed.GetItems().ToList();
        await _db.ScheduleItems.AddRangeAsync(items, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} schedule items.", items.Count);
    }

    private async Task SeedMenuAsync(CancellationToken ct)
    {
        if (await _db.MenuSections.AnyAsync(ct)) return;
        var sections = MenuSeed.GetSectionsWithItems().ToList();
        await _db.MenuSections.AddRangeAsync(sections, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} menu sections.", sections.Count);
    }

    private async Task SeedStaticContentAsync(CancellationToken ct)
    {
        if (await _db.StaticContents.AnyAsync(ct)) return;
        var content = StaticContentSeed.GetContent().ToList();
        await _db.StaticContents.AddRangeAsync(content, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} static content items.", content.Count);
    }

    private async Task SeedLoveStoryAsync(CancellationToken ct)
    {
        if (await _db.LoveStoryEvents.AnyAsync(ct)) return;
        var events = LoveStorySeed.GetEvents().ToList();
        await _db.LoveStoryEvents.AddRangeAsync(events, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} love story events.", events.Count);
    }

    private async Task SeedBingoChallengesAsync(CancellationToken ct)
    {
        if (await _db.BingoChallenges.AnyAsync(ct)) return;
        var challenges = BingoChallengeSeed.GetChallenges().ToList();
        await _db.BingoChallenges.AddRangeAsync(challenges, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} bingo challenges.", challenges.Count);
    }

    private async Task SeedQuestionnaireResponsesAsync(CancellationToken ct)
    {
        if (await _db.QuestionnaireResponses.AnyAsync(ct)) return;

        var guestNames = QuestionnaireResponseSeed.GetResponses().Select(r => r.GuestName).ToHashSet();
        var guests = await _db.Guests
            .Where(g => guestNames.Contains(g.FullName))
            .ToDictionaryAsync(g => g.FullName, ct);

        var responses = new List<QuestionnaireResponse>();
        var offset = 0;
        foreach (var (name, alcohol, hasAllergy, notes) in QuestionnaireResponseSeed.GetResponses())
        {
            if (!guests.TryGetValue(name, out var guest)) continue;
            responses.Add(new QuestionnaireResponse
            {
                GuestId = guest.Id,
                AlcoholPreference = alcohol,
                HasAllergy = hasAllergy,
                AllergyNotes = notes,
                SubmittedAt = DateTime.UtcNow.AddDays(-offset),
            });
            offset++;
        }

        await _db.QuestionnaireResponses.AddRangeAsync(responses, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} questionnaire responses.", responses.Count);
    }

    private async Task SeedSongRequestsAsync(CancellationToken ct)
    {
        if (await _db.SongRequests.AnyAsync(ct)) return;

        var guestNames = SongRequestSeed.GetRequests().Select(r => r.GuestName).ToHashSet();
        var guests = await _db.Guests
            .Where(g => guestNames.Contains(g.FullName))
            .ToDictionaryAsync(g => g.FullName, ct);

        var requests = new List<SongRequest>();
        foreach (var (name, song, artist, dedication, status) in SongRequestSeed.GetRequests())
        {
            if (!guests.TryGetValue(name, out var guest)) continue;
            requests.Add(new SongRequest
            {
                GuestId = guest.Id,
                SongName = song,
                Artist = artist,
                Dedication = dedication,
                Status = status,
            });
        }

        await _db.SongRequests.AddRangeAsync(requests, ct);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} song requests.", requests.Count);
    }
}
