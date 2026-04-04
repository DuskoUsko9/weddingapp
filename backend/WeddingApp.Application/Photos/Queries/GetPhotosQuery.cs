using MediatR;
using WeddingApp.Application.Photos.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Photos.Queries;

public record GetPhotosQuery : IRequest<IReadOnlyList<PhotoDto>>;

public class GetPhotosQueryHandler : IRequestHandler<GetPhotosQuery, IReadOnlyList<PhotoDto>>
{
    private readonly IPhotoRepository _repo;

    public GetPhotosQueryHandler(IPhotoRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<PhotoDto>> Handle(GetPhotosQuery request, CancellationToken ct)
    {
        var photos = await _repo.GetAllAsync(ct);
        return photos
            .Select(p => new PhotoDto(p.Id, p.GuestId, p.Guest?.FullName ?? string.Empty, p.Url, p.FileSizeBytes, p.CreatedAt))
            .ToList();
    }
}
