using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.SongRequests.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.SongRequests.Queries;

public record GetMySongRequestsQuery : IRequest<IReadOnlyList<SongRequestDto>>;

public class GetMySongRequestsQueryHandler : IRequestHandler<GetMySongRequestsQuery, IReadOnlyList<SongRequestDto>>
{
    private readonly ISongRequestRepository _repo;
    private readonly ICurrentUserService _currentUser;

    public GetMySongRequestsQueryHandler(ISongRequestRepository repo, ICurrentUserService currentUser)
    {
        _repo = repo;
        _currentUser = currentUser;
    }

    public async Task<IReadOnlyList<SongRequestDto>> Handle(GetMySongRequestsQuery request, CancellationToken ct)
    {
        if (_currentUser.GuestId is null) return [];
        var items = await _repo.GetByGuestIdAsync(_currentUser.GuestId.Value, ct);
        return items.Select(r => new SongRequestDto(
            r.Id, r.SongName, r.Artist, r.Dedication,
            r.Guest?.FullName ?? string.Empty, r.GuestId,
            r.Status.ToString(), r.CreatedAt)).ToList();
    }
}
