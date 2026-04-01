namespace WeddingApp.Application.Admin.DTOs;

public record AdminStatsDto(
    int TotalGuests,
    int ConfirmedGuests,
    int QuestionnairesSubmitted,
    int SongRequestsTotal,
    int SongRequestsPending,
    IReadOnlyList<string> ActiveFeatureFlags);
