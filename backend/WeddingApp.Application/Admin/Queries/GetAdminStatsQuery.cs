using MediatR;
using WeddingApp.Application.Admin.DTOs;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Admin.Queries;

public record GetAdminStatsQuery : IRequest<AdminStatsDto>;

public class GetAdminStatsQueryHandler : IRequestHandler<GetAdminStatsQuery, AdminStatsDto>
{
    private readonly IGuestRepository _guests;
    private readonly IQuestionnaireRepository _questionnaires;
    private readonly ISongRequestRepository _songRequests;
    private readonly IFeatureFlagRepository _featureFlags;

    public GetAdminStatsQueryHandler(
        IGuestRepository guests,
        IQuestionnaireRepository questionnaires,
        ISongRequestRepository songRequests,
        IFeatureFlagRepository featureFlags)
    {
        _guests = guests;
        _questionnaires = questionnaires;
        _songRequests = songRequests;
        _featureFlags = featureFlags;
    }

    public async Task<AdminStatsDto> Handle(GetAdminStatsQuery request, CancellationToken ct)
    {
        var allGuests = await _guests.GetAllAsync(ct);
        var questionnairesSubmitted = await _questionnaires.CountSubmittedAsync(ct);
        var songRequestsTotal = await _songRequests.CountAsync(ct);

        var pendingRequests = await _songRequests.GetAllAsync(SongRequestStatus.Pending, ct);

        var flags = await _featureFlags.GetAllAsync(ct);
        var now = DateTime.UtcNow;
        var activeFlags = flags
            .Where(f => f.IsCurrentlyEnabled(now))
            .Select(f => f.Key)
            .ToList();

        return new AdminStatsDto(
            TotalGuests: allGuests.Count,
            ConfirmedGuests: allGuests.Count(g => g.IsConfirmed),
            QuestionnairesSubmitted: questionnairesSubmitted,
            SongRequestsTotal: songRequestsTotal,
            SongRequestsPending: pendingRequests.Count,
            ActiveFeatureFlags: activeFlags);
    }
}
