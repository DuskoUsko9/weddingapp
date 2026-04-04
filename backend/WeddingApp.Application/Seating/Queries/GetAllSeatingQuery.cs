using MediatR;
using WeddingApp.Application.Seating.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Seating.Queries;

public record GetAllSeatingQuery : IRequest<IReadOnlyList<SeatingDto>>;

public class GetAllSeatingQueryHandler : IRequestHandler<GetAllSeatingQuery, IReadOnlyList<SeatingDto>>
{
    private readonly ISeatingRepository _repo;

    public GetAllSeatingQueryHandler(ISeatingRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<SeatingDto>> Handle(GetAllSeatingQuery request, CancellationToken ct)
    {
        var all = await _repo.GetAllAsync(ct);
        return all
            .Select(a => new SeatingDto(a.GuestId, a.Guest?.FullName ?? string.Empty, a.TableNumber, a.TableName, a.SeatNote))
            .OrderBy(a => a.TableNumber)
            .ThenBy(a => a.GuestName)
            .ToList();
    }
}
