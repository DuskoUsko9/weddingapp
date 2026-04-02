using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class MenuSeed
{
    public static IEnumerable<MenuSection> GetSectionsWithItems()
    {
        var predjedla = new MenuSection { Name = "Predjedlo", DisplayOrder = 1 };
        predjedla.Items.Add(new MenuItem
        {
            Section = predjedla,
            Name = "Kozí syr",
            Description = "Krémový kozí syr podávaný so sladkým hruškovým chutney a čerstvým domácim chlebom.",
            DisplayOrder = 1,
        });

        var polievka = new MenuSection { Name = "Polievka", DisplayOrder = 2 };
        polievka.Items.Add(new MenuItem
        {
            Section = polievka,
            Name = "Svadobná slepačia polievka",
            Description = "Tradičný pomaly ťahaný vývar z domáceho kuraťa s koreňovou zeleninou, domácimi rezancami a petržlenovou vňaťou.",
            DisplayOrder = 1,
        });

        var hlavne = new MenuSection { Name = "Hlavné jedlo", DisplayOrder = 3 };
        hlavne.Items.Add(new MenuItem
        {
            Section = hlavne,
            Name = "Bravčová panenka so zemiakmi",
            Description = "Bravčová panenka s pečenými baby zemiakmi, grilovanou zeleninou a mrkvovým pyré. Podávané so staročeskou slivkovou omáčkou.",
            DisplayOrder = 1,
        });

        var dezerty = new MenuSection { Name = "Dezert", DisplayOrder = 4 };
        dezerty.Items.Add(new MenuItem
        {
            Section = dezerty,
            Name = "Výber zákuskov a koláčov",
            Description = "Domáce koláče, zákusky a sladkosti pripravené s láskou — slovenská svadobná tradícia.",
            DisplayOrder = 2,
        });

        return [predjedla, polievka, hlavne, dezerty];
    }
}