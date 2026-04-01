namespace WeddingApp.Application.SongRequests.DTOs;

public record SongRequestDto(
    Guid Id,
    string SongName,
    string? Artist,
    string? Dedication,
    string GuestName,
    Guid GuestId,
    string Status,
    DateTime CreatedAt);
