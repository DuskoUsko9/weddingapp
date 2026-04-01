using MediatR;
using WeddingApp.Application.SongRequests.DTOs;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.SongRequests.Queries;

public record GetSongRequestsQuery(string? Status = null) : IRequest<IReadOnlyList<SongRequestDto>>;

public class GetSongRequestsQueryHandler : IRequestHandler<GetSongRequestsQuery, IReadOnlyList<SongRequestDto>>
{
    private readonly ISongRequestRepository _repo;

    public GetSongRequestsQueryHandler(ISongRequestRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<SongRequestDto>> Handle(GetSongRequestsQuery request, CancellationToken ct)
    {
        SongRequestStatus? status = null;
        if (!string.IsNullOrWhiteSpace(request.Status) &&
            Enum.TryParse<SongRequestStatus>(request.Status, ignoreCase: true, out var parsed))
            status = parsed;

        var items = await _repo.GetAllAsync(status, ct);
        return items.Select(r => new SongRequestDto(
            r.Id, r.SongName, r.Artist, r.Dedication,
            r.Guest?.FullName ?? string.Empty, r.GuestId,
            r.Status.ToString(), r.CreatedAt)).ToList();
    }
}
