using MediatR;
using WeddingApp.Application.Questionnaire.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Questionnaire.Queries;

public record GetAllQuestionnaireResponsesQuery : IRequest<QuestionnaireStatsDto>;

public class GetAllQuestionnaireResponsesQueryHandler : IRequestHandler<GetAllQuestionnaireResponsesQuery, QuestionnaireStatsDto>
{
    private readonly IQuestionnaireRepository _repo;
    private readonly IGuestRepository _guests;

    public GetAllQuestionnaireResponsesQueryHandler(
        IQuestionnaireRepository repo,
        IGuestRepository guests)
    {
        _repo = repo;
        _guests = guests;
    }

    public async Task<QuestionnaireStatsDto> Handle(GetAllQuestionnaireResponsesQuery request, CancellationToken ct)
    {
        var allGuests = await _guests.GetAllAsync(ct);
        var responses = await _repo.GetAllAsync(ct);

        var respondedGuestIds = responses.Select(r => r.GuestId).ToHashSet();

        var responseDtos = responses.Select(r =>
        {
            var guest = allGuests.FirstOrDefault(g => g.Id == r.GuestId);
            return new QuestionnaireResponseDto(
                r.Id,
                r.GuestId,
                guest?.FullName ?? string.Empty,
                r.AlcoholPreference.ToString(),
                r.HasAllergy,
                r.AllergyNotes,
                r.SubmittedAt);
        }).ToList();

        var notSubmitted = allGuests
            .Where(g => !respondedGuestIds.Contains(g.Id))
            .Select(g => new NonSubmittedGuestDto(g.Id, g.FullName))
            .ToList();

        return new QuestionnaireStatsDto(
            TotalGuests: allGuests.Count,
            Submitted: responses.Count,
            Responses: responseDtos,
            NotSubmitted: notSubmitted);
    }
}
