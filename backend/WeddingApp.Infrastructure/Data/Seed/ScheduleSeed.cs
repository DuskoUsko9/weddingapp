using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class ScheduleSeed
{
    public static IEnumerable<ScheduleItem> GetItems() =>
    [
        new() { TimeLabel = "15:30", TimeMinutes = 930,  Title = "Svadobný obrad",         Icon = "⛪", DisplayOrder = 1 },
        new() { TimeLabel = "17:00", TimeMinutes = 1020, Title = "Foto session",            Icon = "📸", DisplayOrder = 2 },
        new() { TimeLabel = "18:00", TimeMinutes = 1080, Title = "Príchod hostí na hostinu",Icon = "🚪", DisplayOrder = 3 },
        new() { TimeLabel = "18:30", TimeMinutes = 1110, Title = "Uvítací prípitok",         Icon = "🥂", DisplayOrder = 4 },
        new() { TimeLabel = "19:00", TimeMinutes = 1140, Title = "Prvý tanec",              Icon = "💃", DisplayOrder = 5 },
        new() { TimeLabel = "20:00", TimeMinutes = 1200, Title = "Večera",                  Icon = "🍽️", DisplayOrder = 6 },
        new() { TimeLabel = "22:00", TimeMinutes = 1320, Title = "Svadobná torta",          Icon = "🎂", DisplayOrder = 7 },
        new() { TimeLabel = "22:30", TimeMinutes = 1350, Title = "Tanec a zábava",          Icon = "🎵", DisplayOrder = 8 },
    ];
}
