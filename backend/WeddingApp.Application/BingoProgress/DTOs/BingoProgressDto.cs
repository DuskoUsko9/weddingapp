namespace WeddingApp.Application.BingoProgress.DTOs;

public record BingoChallengeWithProgressDto(
    Guid ChallengeId,
    string Title,
    string? Description,
    int DisplayOrder,
    bool IsCompleted,
    string? PhotoUrl,
    DateTime? CompletedAt);
