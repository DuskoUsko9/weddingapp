using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class LoveStorySeed
{
    public static IEnumerable<LoveStoryEvent> GetEvents() =>
    [
        new()
        {
            EventDate = new DateOnly(2017, 9, 9),
            Title = "Prvé stretnutie",
            Description = "Trnavský jarmok. Noc, diskotéka Relax, tanec. Dušan sľúbil, že ráno príde odprevadiť Maťku na vlak do Martina — a nestihol to. Ale hneď zavolal a pozval ju do kina. 😄",
            DisplayOrder = 1,
        },
        new()
        {
            EventDate = new DateOnly(2017, 9, 13),
            Title = "Prvé rande",
            Description = "Kino Bory Mall, Bratislava. Film Dunkirk. Začiatok niečoho krásneho.",
            DisplayOrder = 2,
        },
        new()
        {
            EventDate = new DateOnly(2017, 9, 17),
            Title = "Druhé rande",
            Description = "Aquapark Relax, Trnava. Tam kde sa to všetko začalo.",
            DisplayOrder = 3,
        },
        new()
        {
            EventDate = new DateOnly(2017, 11, 1),
            Title = "Prvý spoločný výlet",
            Description = "Londýn. Prvá cesta do zahraničia spolu — začiatok spoločných dobrodružstiev.",
            DisplayOrder = 4,
        },
        new()
        {
            EventDate = new DateOnly(2018, 6, 1),
            Title = "Prvá dovolenka",
            Description = "Cyprus. Slnko, more a prvá spoločná dovolenka.",
            DisplayOrder = 5,
        },
        new()
        {
            EventDate = new DateOnly(2018, 7, 1),
            Title = "Spoločné bývanie",
            Description = "Sťahovanie do Bratislavy, prvá spoločná práca po škole. Nový začiatok spolu.",
            DisplayOrder = 6,
        },
        new()
        {
            EventDate = new DateOnly(2019, 7, 1),
            Title = "Nový byt",
            Description = "Presťahovanie z Karlovej Vsi na Kramáre. Ďalší spoločný krok.",
            DisplayOrder = 7,
        },
        new()
        {
            EventDate = new DateOnly(2020, 10, 1),
            Title = "Prvý spoločný byt",
            Description = "Kúpa prvého spoločného bytu v Petržalke. Náš prvý domov.",
            DisplayOrder = 8,
        },
        new()
        {
            EventDate = new DateOnly(2024, 12, 1),
            Title = "Zásnuby 💍",
            Description = "Dušan požiadal Maťku o ruku. Ona povedala áno.",
            DisplayOrder = 9,
        },
        new()
        {
            EventDate = new DateOnly(2025, 5, 1),
            Title = "Nový domov",
            Description = "Sťahovanie do nového bytu v Lamači. Prípravy na svadbu v plnom prúde.",
            DisplayOrder = 10,
        },
        new()
        {
            EventDate = new DateOnly(2026, 9, 5),
            Title = "Svadba 🎉",
            Description = "Penzión Zemiansky Dvor, Surovce. To be continued...",
            DisplayOrder = 11,
        },
    ];
}
