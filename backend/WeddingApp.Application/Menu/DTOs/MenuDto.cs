namespace WeddingApp.Application.Menu.DTOs;

public record MenuItemDto(
    Guid Id,
    Guid SectionId,
    string Name,
    string? Description,
    int DisplayOrder);

public record MenuSectionDto(
    Guid Id,
    string Name,
    int DisplayOrder,
    IReadOnlyList<MenuItemDto> Items);
