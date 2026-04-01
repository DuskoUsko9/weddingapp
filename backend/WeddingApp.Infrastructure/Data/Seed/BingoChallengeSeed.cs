using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class BingoChallengeSeed
{
    public static IEnumerable<BingoChallenge> GetChallenges() =>
    [
        new() { Title = "Ženích sa smeje od ucha k uchu",           DisplayOrder = 1  },
        new() { Title = "Nevesta plače od dojatia",                  DisplayOrder = 2  },
        new() { Title = "Dieťa tancuje samo na parkete",             DisplayOrder = 3  },
        new() { Title = "Niekto spieva s kapelou",                   DisplayOrder = 4  },
        new() { Title = "Dvaja hostia v rovnakých šatách",           DisplayOrder = 5  },
        new() { Title = "Niekto zaspal na stoličke",                 DisplayOrder = 6  },
        new() { Title = "Selfie so svadobným párom",                 DisplayOrder = 7  },
        new() { Title = "Prvý tanec svadobného páru",                DisplayOrder = 8  },
        new() { Title = "Svadobná torta sa krája",                   DisplayOrder = 9  },
        new() { Title = "Skupina ľudí tancuje v kruhu",              DisplayOrder = 10 },
        new() { Title = "Niekto hádzal kvety",                       DisplayOrder = 11 },
        new() { Title = "Starý rodič na parkete tancuje",            DisplayOrder = 12 },
    ];
}
