using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class ScheduleSeed
{
    public static IEnumerable<ScheduleItem> GetItems() =>
    [
        new()
        {
            TimeLabel = "15:30", TimeMinutes = 930, Title = "Svadobný obrad", Icon = "⛪", DisplayOrder = 1,
            Description = "Officiálne spečatenie našej lásky. Obrad sa koná vonku v areáli Penziónu Zemiansky Dvor.",
        },
        new()
        {
            TimeLabel = "17:00", TimeMinutes = 1020, Title = "Foto session", Icon = "📸", DisplayOrder = 2,
            Description = "Spoločné fotografie svadobného páru a hostí v krásnom prostredí penziónu.",
        },
        new()
        {
            TimeLabel = "18:00", TimeMinutes = 1080, Title = "Príchod hostí na hostinu", Icon = "🚪", DisplayOrder = 3,
            Description = "Slávnostné otvorenie sály a privítanie hostí na svadobnej hostine.",
        },
        new()
        {
            TimeLabel = "18:30", TimeMinutes = 1110, Title = "Uvítací prípitok", Icon = "🥂", DisplayOrder = 4,
            Description = "Spoločné prípitky a prvé slová starejšieho. Príležitosť na gratulácie a fotky so svadobným párom.",
        },
        new()
        {
            TimeLabel = "19:00", TimeMinutes = 1140, Title = "Prvý tanec", Icon = "💃", DisplayOrder = 5,
            Description = "Otvorenie tanečného parketu. Prvý tanec Maťky a Dušana — a potom tancujeme všetci!",
        },
        new()
        {
            TimeLabel = "20:00", TimeMinutes = 1200, Title = "Slávnostná večera", Icon = "🍽️", DisplayOrder = 6,
            Description = "Svadobné menu podávané v sále. Teplé jedlá, studený bufet a svadobné špeciality.",
        },
        new()
        {
            TimeLabel = "22:00", TimeMinutes = 1320, Title = "Svadobná torta", Icon = "🎂", DisplayOrder = 7,
            Description = "Krájanie svadobnej torty — sladká bodka za slávnostnou večerou a polnočné prekvapenie.",
        },
        new()
        {
            TimeLabel = "22:30", TimeMinutes = 1350, Title = "Tanec a zábava", Icon = "🎵", DisplayOrder = 8,
            Description = "Noc ešte len začína! Hudba, tanec a svadobná atmosféra až do rána.",
        },
    ];
}