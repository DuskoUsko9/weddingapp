using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Questionnaire.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Questionnaire.Queries;

public record GetMyQuestionnaireQuery : IRequest<QuestionnaireResponseDto?>;

public class GetMyQuestionnaireQueryHandler : IRequestHandler<GetMyQuestionnaireQuery, QuestionnaireResponseDto?>
{
    private readonly IQuestionnaireRepository _repo;
    private readonly IGuestRepository _guests;
    private readonly ICurrentUserService _currentUser;

    public GetMyQuestionnaireQueryHandler(
        IQuestionnaireRepository repo,
        IGuestRepository guests,
        ICurrentUserService currentUser)
    {
        _repo = repo;
        _guests = guests;
        _currentUser = currentUser;
    }

    public async Task<QuestionnaireResponseDto?> Handle(GetMyQuestionnaireQuery request, CancellationToken ct)
    {
        var guestId = _currentUser.GuestId;
        if (guestId is null) return null;

        var entity = await _repo.GetByGuestIdAsync(guestId.Value, ct);
        if (entity is null) return null;

        var guest = await _guests.GetByIdAsync(guestId.Value, ct);

        return new QuestionnaireResponseDto(
            entity.Id,
            entity.GuestId,
            guest?.FullName ?? string.Empty,
            entity.AlcoholPreference.ToString(),
            entity.HasAllergy,
            entity.AllergyNotes,
            entity.SubmittedAt);
    }
}
