using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class MenuSeed
{
    public static IEnumerable<MenuSection> GetSectionsWithItems()
    {
        var predjedla = new MenuSection { Name = "Predjedlá", DisplayOrder = 1 };
        predjedla.Items.Add(new MenuItem { Section = predjedla, Name = "Šunkovo-syrová plnka",     DisplayOrder = 1 });
        predjedla.Items.Add(new MenuItem { Section = predjedla, Name = "Bruschetta s paradajkami", DisplayOrder = 2 });

        var polievka = new MenuSection { Name = "Polievka", DisplayOrder = 2 };
        polievka.Items.Add(new MenuItem { Section = polievka, Name = "Svadobná slepačia polievka", DisplayOrder = 1 });

        var hlavne = new MenuSection { Name = "Hlavné jedlo", DisplayOrder = 3 };
        hlavne.Items.Add(new MenuItem { Section = hlavne, Name = "Pečené bravčové so zemiakovou kašou", DisplayOrder = 1 });
        hlavne.Items.Add(new MenuItem { Section = hlavne, Name = "Grilované kuracie prsia so zeleninou", DisplayOrder = 2 });

        var dezerty = new MenuSection { Name = "Dezerty", DisplayOrder = 4 };
        dezerty.Items.Add(new MenuItem { Section = dezerty, Name = "Svadobná torta",           DisplayOrder = 1 });
        dezerty.Items.Add(new MenuItem { Section = dezerty, Name = "Výber zákuskov a koláčov", DisplayOrder = 2 });

        return [predjedla, polievka, hlavne, dezerty];
    }
}
