namespace WeddingApp.Application.BingoChallenges.DTOs;

public record BingoChallengeDto(
    Guid Id,
    string Title,
    string? Description,
    int DisplayOrder,
    bool IsActive);
