namespace WeddingApp.Application.LoveStory.DTOs;

public record LoveStoryEventDto(
    Guid Id,
    string EventDate,        // "yyyy-MM-dd"
    string Title,
    string? Description,
    string? PhotoUrl,
    int DisplayOrder);
