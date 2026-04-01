using MediatR;
using WeddingApp.Application.Schedule.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Schedule.Queries;

public record GetScheduleQuery : IRequest<IReadOnlyList<ScheduleItemDto>>;

public class GetScheduleQueryHandler : IRequestHandler<GetScheduleQuery, IReadOnlyList<ScheduleItemDto>>
{
    private readonly IScheduleRepository _repo;

    public GetScheduleQueryHandler(IScheduleRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<ScheduleItemDto>> Handle(GetScheduleQuery request, CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);

        return items
            .OrderBy(i => i.TimeMinutes)
            .ThenBy(i => i.DisplayOrder)
            .Select(i => new ScheduleItemDto(
                i.Id,
                i.TimeLabel,
                i.TimeMinutes,
                i.Title,
                i.Description,
                i.Icon,
                i.DisplayOrder))
            .ToList();
    }
}
