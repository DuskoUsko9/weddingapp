namespace WeddingApp.Application.Photos.DTOs;

public record PhotoDto(
    Guid Id,
    Guid GuestId,
    string GuestName,
    string Url,
    long FileSizeBytes,
    DateTime UploadedAt);
