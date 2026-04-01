using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class GuestSeed
{
    public static IEnumerable<Guest> GetGuests() =>
    [
        // ── Nevesta / Bride side ─────────────────────────────────────────────
        G("Danica Hulejová",          GuestSide.Bride, false, null,  AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Stanislav Hulej",          GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Ivana Hulejová",           GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Martin Fillo",             GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Oľga Chabadová",           GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Michaela Divincová",       GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Dominika Divincová",       GuestSide.Bride, true,  11,    AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Richard Chabada",          GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Martina Chabadová",        GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Riško Chabada",            GuestSide.Bride, true,  11,    AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Maťko Chabada",            GuestSide.Bride, true,  11,    AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Viliam Raffaj",            GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Viera Raffajová",          GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Andrej Raffaj",            GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Boris Raffaj",             GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Kristína Raffajová",       GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Syn Borisa a Kiky",        GuestSide.Bride, true,  0,     AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Barbara Sulkowska",        GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends),
        G("Baska polovicka",          GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends),
        G("Monika Lichnerová",        GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends),
        G("Antonin Čajka",            GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends),
        G("Lucia Godovská",           GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues),
        G("Lucka polovicka",          GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues),
        G("Janka Babinska",           GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends),
        G("Janka polovička",          GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends),
        G("Heidi Hoghová",            GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends),
        G("Heidi partner",            GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends),
        G("Monika Zajacová Gogová",   GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues),
        G("Slávka Pavlovičová",       GuestSide.Bride, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues),

        // ── Ženích / Groom side ──────────────────────────────────────────────
        G("Katarína Hudcovičová",     GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Marči",                    GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Kamila Jankovičová",       GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Tomáš Jankovič",           GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Dominika Jankovičová",     GuestSide.Groom, true,  4,     AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Jozef Hrušovský",          GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Eva Hrušovská",            GuestSide.Groom, false, null,  AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Jozef Hrušovský ml.",      GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Aneta Kristová",           GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Mária Hrušovská",          GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Ľuboš Kopčan",             GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Karolínka Kopčanová",      GuestSide.Groom, true,  8,     AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Michal Hrušovský",         GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Pavol Hrušovský",          GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Zuzana Hrušovská",         GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Eliška Hrušovská",         GuestSide.Groom, true,  13,    AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Agátka Hrušovská",         GuestSide.Groom, true,  5,     AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Marek",                    GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Nika (Marekova)",          GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Jakub Kováčik",            GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Simona Kováčiková",        GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Dianka Kováčiková",        GuestSide.Groom, true,  3,     AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Ondrej Hudcovič",          GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Lenka Hudcovičová",        GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Amálka Hudcovičová",       GuestSide.Groom, true,  2,     AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Marián Barcaj",            GuestSide.Groom, false, null,  AlcoholPreference.NonDrinker, GuestCategory.Family),
        G("Eva Barcajová",            GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Family),
        G("Peter Lipovský",           GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Veronika Lipovská",        GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Ján Hudec",                GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Martina Hudecová",         GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Marcela Sečkárová",        GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Samuel Sečkár",            GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Martin Musil",             GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Michaela Musilová",        GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Adam Strigáč",             GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Paula (Adamova)",          GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Colleagues, "After20"),
        G("Katka",                    GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends,    "After20"),
        G("Dado",                     GuestSide.Groom, false, null,  AlcoholPreference.Drinks,     GuestCategory.Friends,    "After20"),

        // ── Suppliers / Potrební k svadbe ────────────────────────────────────
        G("Fotograf",  GuestSide.Both, false, null, AlcoholPreference.Drinks, GuestCategory.Supplier),
        G("Kameraman", GuestSide.Both, false, null, AlcoholPreference.Drinks, GuestCategory.Supplier),
        G("Šofér 1",   GuestSide.Both, false, null, AlcoholPreference.NonDrinker, GuestCategory.Supplier),
        G("Šofér 2",   GuestSide.Both, false, null, AlcoholPreference.NonDrinker, GuestCategory.Supplier),
        G("Farárka",   GuestSide.Both, false, null, AlcoholPreference.NonDrinker, GuestCategory.Supplier),
    ];

    private static Guest G(
        string fullName,
        GuestSide side,
        bool isChild,
        int? age,
        AlcoholPreference alcohol,
        GuestCategory category,
        string guestType = "Standard") => new()
    {
        FullName = fullName,
        NormalizedName = fullName.ToLowerInvariant(),
        Side = side,
        IsChild = isChild,
        AgeAtWedding = age,
        AlcoholDefault = alcohol,
        Category = category,
        GuestType = guestType,
        IsConfirmed = true,
    };
}
