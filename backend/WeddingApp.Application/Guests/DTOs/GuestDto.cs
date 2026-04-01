namespace WeddingApp.Application.Guests.DTOs;

public record GuestDto(
    Guid Id,
    string FullName,
    string Side,
    bool IsChild,
    int? AgeAtWedding,
    string Category,
    string GuestType,
    bool IsConfirmed,
    bool HasQuestionnaire);
