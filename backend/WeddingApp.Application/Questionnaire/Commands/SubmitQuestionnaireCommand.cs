using FluentValidation;
using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Questionnaire.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Questionnaire.Commands;

public record SubmitQuestionnaireCommand(
    string AlcoholPreference,
    bool HasAllergy,
    string? AllergyNotes) : IRequest<QuestionnaireResponseDto>;

public class SubmitQuestionnaireCommandValidator : AbstractValidator<SubmitQuestionnaireCommand>
{
    private static readonly string[] ValidPreferences = ["Drinks", "WineOnly", "BeerOnly", "NonDrinker"];

    public SubmitQuestionnaireCommandValidator()
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

public class SubmitQuestionnaireCommandHandler : IRequestHandler<SubmitQuestionnaireCommand, QuestionnaireResponseDto>
{
    private readonly IQuestionnaireRepository _repo;
    private readonly IGuestRepository _guests;
    private readonly ICurrentUserService _currentUser;

    public SubmitQuestionnaireCommandHandler(
        IQuestionnaireRepository repo,
        IGuestRepository guests,
        ICurrentUserService currentUser)
    {
        _repo = repo;
        _guests = guests;
        _currentUser = currentUser;
    }

    public async Task<QuestionnaireResponseDto> Handle(SubmitQuestionnaireCommand request, CancellationToken ct)
    {
        var guestId = _currentUser.GuestId
            ?? throw new InvalidOperationException("Guest ID required for questionnaire submission.");

        var existing = await _repo.GetByGuestIdAsync(guestId, ct);
        if (existing is not null)
            throw new InvalidOperationException("Dotazník bol už odoslaný. Na úpravu použite PUT.");

        var guest = await _guests.GetByIdAsync(guestId, ct)
            ?? throw new InvalidOperationException("Hosť nebol nájdený.");

        var entity = new QuestionnaireResponse
        {
            GuestId = guestId,
            AlcoholPreference = Enum.Parse<AlcoholPreference>(request.AlcoholPreference, ignoreCase: true),
            HasAllergy = request.HasAllergy,
            AllergyNotes = request.AllergyNotes?.Trim(),
            SubmittedAt = DateTime.UtcNow,
        };

        await _repo.AddAsync(entity, ct);

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
