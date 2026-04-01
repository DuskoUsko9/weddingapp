using MediatR;
using WeddingApp.Application.LoveStory.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.LoveStory.Queries;

public record GetLoveStoryQuery : IRequest<IReadOnlyList<LoveStoryEventDto>>;

public class GetLoveStoryQueryHandler : IRequestHandler<GetLoveStoryQuery, IReadOnlyList<LoveStoryEventDto>>
{
    private readonly ILoveStoryRepository _repo;

    public GetLoveStoryQueryHandler(ILoveStoryRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<LoveStoryEventDto>> Handle(GetLoveStoryQuery request, CancellationToken ct)
    {
        var events = await _repo.GetAllAsync(ct);

        return events
            .OrderBy(e => e.EventDate)
            .ThenBy(e => e.DisplayOrder)
            .Select(e => new LoveStoryEventDto(
                e.Id,
                e.EventDate.ToString("yyyy-MM-dd"),
                e.Title,
                e.Description,
                e.PhotoUrl,
                e.DisplayOrder))
            .ToList();
    }
}
