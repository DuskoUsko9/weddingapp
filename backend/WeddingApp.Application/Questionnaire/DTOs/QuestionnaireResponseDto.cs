namespace WeddingApp.Application.Questionnaire.DTOs;

public record QuestionnaireResponseDto(
    Guid Id,
    Guid GuestId,
    string GuestName,
    string AlcoholPreference,
    bool HasAllergy,
    string? AllergyNotes,
    DateTime SubmittedAt);

public record QuestionnaireStatsDto(
    int TotalGuests,
    int Submitted,
    IReadOnlyList<QuestionnaireResponseDto> Responses,
    IReadOnlyList<NonSubmittedGuestDto> NotSubmitted);

public record NonSubmittedGuestDto(Guid GuestId, string GuestName);
