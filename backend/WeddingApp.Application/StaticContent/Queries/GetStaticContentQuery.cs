using MediatR;
using WeddingApp.Application.StaticContent.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.StaticContent.Queries;

public record GetStaticContentQuery(string Key) : IRequest<StaticContentDto?>;

public class GetStaticContentQueryHandler : IRequestHandler<GetStaticContentQuery, StaticContentDto?>
{
    private readonly IStaticContentRepository _repo;

    public GetStaticContentQueryHandler(IStaticContentRepository repo) => _repo = repo;

    public async Task<StaticContentDto?> Handle(GetStaticContentQuery request, CancellationToken ct)
    {
        var entity = await _repo.GetByKeyAsync(request.Key, ct);
        if (entity is null) return null;

        return new StaticContentDto(entity.Id, entity.Key, entity.Title, entity.Content, entity.Metadata);
    }
}
