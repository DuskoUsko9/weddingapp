using FluentValidation;
using MediatR;
using WeddingApp.Application.Schedule.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Schedule.Commands;

public record CreateScheduleItemCommand(
    string TimeLabel,
    int TimeMinutes,
    string Title,
    string? Description,
    string? Icon,
    int DisplayOrder) : IRequest<ScheduleItemDto>;

public class CreateScheduleItemCommandValidator : AbstractValidator<CreateScheduleItemCommand>
{
    public CreateScheduleItemCommandValidator()
    {
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

public class CreateScheduleItemCommandHandler : IRequestHandler<CreateScheduleItemCommand, ScheduleItemDto>
{
    private readonly IScheduleRepository _repo;

    public CreateScheduleItemCommandHandler(IScheduleRepository repo) => _repo = repo;

    public async Task<ScheduleItemDto> Handle(CreateScheduleItemCommand request, CancellationToken ct)
    {
        var entity = new ScheduleItem
        {
            TimeLabel = request.TimeLabel.Trim(),
            TimeMinutes = request.TimeMinutes,
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Icon = request.Icon?.Trim(),
            DisplayOrder = request.DisplayOrder,
        };

        await _repo.AddAsync(entity, ct);

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
