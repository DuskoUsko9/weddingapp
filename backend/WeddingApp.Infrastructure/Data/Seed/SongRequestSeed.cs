using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Infrastructure.Data.Seed;

public static class SongRequestSeed
{
    // Each tuple: (guestName, songName, artist, dedication, status)
    public static IReadOnlyList<(string GuestName, string SongName, string? Artist, string? Dedication, SongRequestStatus Status)> GetRequests() =>
    [
        ("Martin Fillo",       "Domov",                    "Rytmus ft. Emma Drobná",  "Táto pieseň mi vždy zdvihne náladu!",         SongRequestStatus.Pending),
        ("Barbara Sulkowska",  "Dancing Queen",             "ABBA",                    "Pre svadobný pár — nech sa točí parket!",      SongRequestStatus.Pending),
        ("Tomáš Jankovič",     "Sweet Home Alabama",        "Lynyrd Skynyrd",          null,                                           SongRequestStatus.Played),
        ("Ivana Hulejová",     "A Thousand Years",          "Christina Perri",          "Pre Maťku a Dušana — láska na celý život.",   SongRequestStatus.Pending),
        ("Jakub Kováčik",      "Bohemian Rhapsody",         "Queen",                    null,                                           SongRequestStatus.Pending),
        ("Monika Lichnerová",  "September",                 "Earth, Wind & Fire",       "Tancovať musíme všetci!",                     SongRequestStatus.Pending),
        ("Andrej Raffaj",      "Smells Like Teen Spirit",   "Nirvana",                  "Len tak pre radosť 😄",                       SongRequestStatus.Skipped),
        ("Stanislav Hulej",    "My Way",                    "Frank Sinatra",            null,                                           SongRequestStatus.Pending),
        ("Peter Lipovský",     "Waterloo",                  "ABBA",                     "ABBA forever!",                               SongRequestStatus.Pending),
        ("Kristína Raffajová", "All of Me",                 "John Legend",              "Krásna pieseň pre krásny deň.",               SongRequestStatus.Pending),
    ];
}
