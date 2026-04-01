using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class MenuSeed
{
    public static IEnumerable<MenuSection> GetSectionsWithItems()
    {
        var predjedla = new MenuSection { Name = "Predjedlá", DisplayOrder = 1 };
        predjedla.Items.Add(new MenuItem
        {
            Section = predjedla,
            Name = "Šunkovo-syrová plnka",
            Description = "Jemná plnka zo šunky a syrového krému, podávaná s chrumkavými krekrami a čerstvou zeleninou.",
            DisplayOrder = 1,
        });
        predjedla.Items.Add(new MenuItem
        {
            Section = predjedla,
            Name = "Bruschetta s paradajkami",
            Description = "Opečené plátky ciabatty s čerstvými paradajkami, bazalkou, cesnakom a olivovým olejom.",
            DisplayOrder = 2,
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
            Name = "Pečené bravčové so zemiakovou kašou",
            Description = "Pomaly pečená bravčová panenka s bylinkovým korením, podávaná s krémovou zemiakovou kašou a pečenou zeleninou.",
            DisplayOrder = 1,
        });
        hlavne.Items.Add(new MenuItem
        {
            Section = hlavne,
            Name = "Grilované kuracie prsia so zeleninou",
            Description = "Šťavnaté kuracie prsia marinované v bylinách, grilované a podávané so sezónnou zeleninou.",
            DisplayOrder = 2,
        });

        var dezerty = new MenuSection { Name = "Dezerty", DisplayOrder = 4 };
        dezerty.Items.Add(new MenuItem
        {
            Section = dezerty,
            Name = "Svadobná torta",
            Description = "Naša špeciálne pripravená svadobná torta — prekvapenie čaká na krájanie!",
            DisplayOrder = 1,
        });
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