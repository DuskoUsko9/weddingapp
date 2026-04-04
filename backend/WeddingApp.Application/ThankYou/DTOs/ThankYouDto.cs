namespace WeddingApp.Application.ThankYou.DTOs;

public record ThankYouDto(
    Guid GuestId,
    string GuestName,
    string Message,
    string? PhotoUrl);
