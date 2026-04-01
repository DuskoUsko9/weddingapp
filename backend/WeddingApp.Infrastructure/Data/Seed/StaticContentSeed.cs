using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class StaticContentSeed
{
    public static IEnumerable<StaticContent> GetContent() =>
    [
        new()
        {
            Key = "parking",
            Title = "Parkovanie",
            Content = "Parkovisko sa nachádza priamo pri Penzióne Zemiansky Dvor v Surovciach. Kapacita je dostatočná pre všetkých hostí. Príjazd je možný z hlavnej cesty smerom na Surovce.",
            Metadata = """{"mapUrl":"https://maps.google.com/?q=Penz%C3%ADon+Zemiansky+Dvor+Surovce","coordinates":{"lat":48.5,"lng":17.8}}""",
        },
        new()
        {
            Key = "accommodation",
            Title = "Ubytovanie",
            Content = "Ubytovanie je priamo v Penzióne Zemiansky Dvor v Surovciach. Izby sú k dispozícii pre hostí, ktorí zostávajú cez noc. Raňajky nie sú zahrnuté v cene ubytovania. V prípade záujmu kontaktujte organizátorov.",
            Metadata = """{"checkInDate":"2026-09-05","breakfastIncluded":false,"note":"Raňajky nie sú v cene ubytovania"}""",
        },
    ];
}
