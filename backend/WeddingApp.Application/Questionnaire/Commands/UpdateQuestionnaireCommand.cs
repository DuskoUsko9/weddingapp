using FluentValidation;
using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Questionnaire.DTOs;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Questionnaire.Commands;

public record UpdateQuestionnaireCommand(
    string AlcoholPreference,
    bool HasAllergy,
    string? AllergyNotes) : IRequest<QuestionnaireResponseDto?>;

public class UpdateQuestionnaireCommandValidator : AbstractValidator<UpdateQuestionnaireCommand>
{
    private static readonly string[] ValidPreferences = ["Drinks", "WineOnly", "BeerOnly", "NonDrinker"];

    public UpdateQuestionnaireCommandValidator()
    {
        RuleFor(x => x.AlcoholPreference)
            .NotEmpty().WithMessage("Zadaj prosím svoju preferenciu alkoholu.")
            .Must(p => ValidPreferences.Contains(p, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Preferencia alkoholu musí byť jedna z: Drinks, WineOnly, BeerOnly, NonDrinker.");

        RuleFor(x => x.AllergyNotes)
            .NotEmpty().WithMessage("Zadaj prosím poznámku k alergii.")
            .When(x => x.HasAllergy);

        RuleFor(x => x.AllergyNotes)
            .MaximumLength(500).WithMessage("Poznámka k alergii môže mať maximálne 500 znakov.")
            .When(x => x.AllergyNotes is not null);
    }
}

public class UpdateQuestionnaireCommandHandler : IRequestHandler<UpdateQuestionnaireCommand, QuestionnaireResponseDto?>
{
    private readonly IQuestionnaireRepository _repo;
    private readonly IGuestRepository _guests;
    private readonly ICurrentUserService _currentUser;

    public UpdateQuestionnaireCommandHandler(
        IQuestionnaireRepository repo,
        IGuestRepository guests,
        ICurrentUserService currentUser)
    {
        _repo = repo;
        _guests = guests;
        _currentUser = currentUser;
    }

    public async Task<QuestionnaireResponseDto?> Handle(UpdateQuestionnaireCommand request, CancellationToken ct)
    {
        var guestId = _currentUser.GuestId
            ?? throw new InvalidOperationException("Guest ID required for questionnaire update.");

        var entity = await _repo.GetByGuestIdAsync(guestId, ct);
        if (entity is null) return null;

        var guest = await _guests.GetByIdAsync(guestId, ct)
            ?? throw new InvalidOperationException("Hosť nebol nájdený.");

        entity.AlcoholPreference = Enum.Parse<AlcoholPreference>(request.AlcoholPreference, ignoreCase: true);
        entity.HasAllergy = request.HasAllergy;
        entity.AllergyNotes = request.AllergyNotes?.Trim();
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, ct);

        return new QuestionnaireResponseDto(
            entity.Id,
            entity.GuestId,
            guest.FullName,
            entity.AlcoholPreference.ToString(),
            entity.HasAllergy,
            entity.AllergyNotes,
            entity.SubmittedAt);
    }
}
