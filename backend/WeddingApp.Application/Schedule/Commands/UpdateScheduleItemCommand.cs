using FluentValidation;
using MediatR;
using WeddingApp.Application.Schedule.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Schedule.Commands;

public record UpdateScheduleItemCommand(
    Guid Id,
    string TimeLabel,
    int TimeMinutes,
    string Title,
    string? Description,
    string? Icon,
    int DisplayOrder) : IRequest<ScheduleItemDto?>;

public class UpdateScheduleItemCommandValidator : AbstractValidator<UpdateScheduleItemCommand>
{
    public UpdateScheduleItemCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.TimeLabel)
            .NotEmpty().WithMessage("Zadaj prosím časový štítok.")
            .MaximumLength(10).WithMessage("Časový štítok môže mať maximálne 10 znakov.");

        RuleFor(x => x.TimeMinutes)
            .InclusiveBetween(0, 1439).WithMessage("Čas musí byť v rozsahu 0 až 1439 minút.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Zadaj prosím názov položky.")
            .MaximumLength(300).WithMessage("Názov položky môže mať maximálne 300 znakov.");
    }
}

public class UpdateScheduleItemCommandHandler : IRequestHandler<UpdateScheduleItemCommand, ScheduleItemDto?>
{
    private readonly IScheduleRepository _repo;

    public UpdateScheduleItemCommandHandler(IScheduleRepository repo) => _repo = repo;

    public async Task<ScheduleItemDto?> Handle(UpdateScheduleItemCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct);
        if (entity is null) return null;

        entity.TimeLabel = request.TimeLabel.Trim();
        entity.TimeMinutes = request.TimeMinutes;
        entity.Title = request.Title.Trim();
        entity.Description = request.Description?.Trim();
        entity.Icon = request.Icon?.Trim();
        entity.DisplayOrder = request.DisplayOrder;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, ct);

        return new ScheduleItemDto(
            entity.Id,
            entity.TimeLabel,
            entity.TimeMinutes,
            entity.Title,
            entity.Description,
            entity.Icon,
            entity.DisplayOrder);
    }
}
