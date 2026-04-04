using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class QuestionnaireResponseSeed
{
    // Each tuple: (guestName, alcoholPreference, hasAllergy, allergyNotes)
    public static IReadOnlyList<(string GuestName, AlcoholPreference Alcohol, bool HasAllergy, string? Notes)> GetResponses() =>
    [
        ("Danica Hulejová",     AlcoholPreference.NonDrinker, false, null),
        ("Stanislav Hulej",     AlcoholPreference.Drinks,     false, null),
        ("Ivana Hulejová",      AlcoholPreference.WineOnly,   false, null),
        ("Martin Fillo",        AlcoholPreference.Drinks,     false, null),
        ("Oľga Chabadová",      AlcoholPreference.WineOnly,   true,  "Laktóza"),
        ("Richard Chabada",     AlcoholPreference.Drinks,     false, null),
        ("Martina Chabadová",   AlcoholPreference.WineOnly,   false, null),
        ("Viliam Raffaj",       AlcoholPreference.BeerOnly,   false, null),
        ("Viera Raffajová",     AlcoholPreference.NonDrinker, false, null),
        ("Andrej Raffaj",       AlcoholPreference.Drinks,     false, null),
        ("Boris Raffaj",        AlcoholPreference.Drinks,     false, null),
        ("Kristína Raffajová",  AlcoholPreference.WineOnly,   true,  "Lepok — celiakia"),
        ("Barbara Sulkowska",   AlcoholPreference.Drinks,     false, null),
        ("Monika Lichnerová",   AlcoholPreference.WineOnly,   false, null),
        ("Tomáš Jankovič",      AlcoholPreference.Drinks,     false, null),
        ("Jakub Kováčik",       AlcoholPreference.BeerOnly,   false, null),
        ("Lenka Hudcovičová",   AlcoholPreference.NonDrinker, false, null),
        ("Katarína Hudcovičová",AlcoholPreference.WineOnly,   false, null),
    ];
}
