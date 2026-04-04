namespace WeddingApp.Application.Seating.DTOs;

public record SeatingDto(
    Guid GuestId,
    string GuestName,
    int TableNumber,
    string? TableName,
    string? SeatNote);

public record MySeatingDto(
    int TableNumber,
    string? TableName,
    string? SeatNote,
    IReadOnlyList<string> Tablemates);
