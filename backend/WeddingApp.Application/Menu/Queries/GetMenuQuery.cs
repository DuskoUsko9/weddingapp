using MediatR;
using WeddingApp.Application.Menu.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Menu.Queries;

public record GetMenuQuery : IRequest<IReadOnlyList<MenuSectionDto>>;

public class GetMenuQueryHandler : IRequestHandler<GetMenuQuery, IReadOnlyList<MenuSectionDto>>
{
    private readonly IMenuRepository _repo;

    public GetMenuQueryHandler(IMenuRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<MenuSectionDto>> Handle(GetMenuQuery request, CancellationToken ct)
    {
        var sections = await _repo.GetAllSectionsWithItemsAsync(ct);

        return sections
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new MenuSectionDto(
                s.Id,
                s.Name,
                s.DisplayOrder,
                s.Items
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i => new MenuItemDto(i.Id, i.SectionId, i.Name, i.Description, i.DisplayOrder))
                    .ToList()))
            .ToList();
    }
}
