using MediatR;
using WeddingApp.Application.Guests.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Guests.Queries;

public record GetGuestsQuery(string? Search = null) : IRequest<IReadOnlyList<GuestDto>>;

public class GetGuestsQueryHandler : IRequestHandler<GetGuestsQuery, IReadOnlyList<GuestDto>>
{
    private readonly IGuestRepository _repo;

    public GetGuestsQueryHandler(IGuestRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<GuestDto>> Handle(GetGuestsQuery request, CancellationToken ct)
    {
        var guests = await _repo.GetAllAsync(ct);

        var filtered = string.IsNullOrWhiteSpace(request.Search)
            ? guests
            : guests.Where(g => g.FullName.Contains(request.Search, StringComparison.OrdinalIgnoreCase)).ToList();

        return filtered
            .Select(g => new GuestDto(
                g.Id,
                g.FullName,
                g.Side.ToString(),
                g.IsChild,
                g.AgeAtWedding,
                g.Category.ToString(),
                g.GuestType,
                g.IsConfirmed,
                g.QuestionnaireResponse is not null))
            .ToList();
    }
}
