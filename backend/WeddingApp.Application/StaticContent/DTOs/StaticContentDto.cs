namespace WeddingApp.Application.StaticContent.DTOs;

public record StaticContentDto(
    Guid Id,
    string Key,
    string Title,
    string Content,
    string? Metadata);
