using MediatR;
using WeddingApp.Application.Seating.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Seating.Queries;

public record GetMySeatingQuery(Guid GuestId) : IRequest<MySeatingDto?>;

public class GetMySeatingQueryHandler : IRequestHandler<GetMySeatingQuery, MySeatingDto?>
{
    private readonly ISeatingRepository _repo;

    public GetMySeatingQueryHandler(ISeatingRepository repo) => _repo = repo;

    public async Task<MySeatingDto?> Handle(GetMySeatingQuery request, CancellationToken ct)
    {
        var assignment = await _repo.GetByGuestIdAsync(request.GuestId, ct);
        if (assignment is null) return null;

        var tablemates = await _repo.GetByTableNumberAsync(assignment.TableNumber, ct);
        var names = tablemates
            .Where(t => t.GuestId != request.GuestId)
            .Select(t => t.Guest?.FullName ?? string.Empty)
            .Where(n => !string.IsNullOrEmpty(n))
            .OrderBy(n => n)
            .ToList();

        return new MySeatingDto(assignment.TableNumber, assignment.TableName, assignment.SeatNote, names);
    }
}
