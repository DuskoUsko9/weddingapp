namespace WeddingApp.Application.Schedule.DTOs;

public record ScheduleItemDto(
    Guid Id,
    string TimeLabel,
    int TimeMinutes,
    string Title,
    string? Description,
    string? Icon,
    int DisplayOrder);
