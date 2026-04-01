using FluentValidation;
using MediatR;
using WeddingApp.Application.LoveStory.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.LoveStory.Commands;

public record CreateLoveStoryEventCommand(
    string EventDate,
    string Title,
    string? Description,
    int DisplayOrder) : IRequest<LoveStoryEventDto>;

public class CreateLoveStoryEventCommandValidator : AbstractValidator<CreateLoveStoryEventCommand>
{
    public CreateLoveStoryEventCommandValidator()
    {
        RuleFor(x => x.EventDate)
            .NotEmpty().WithMessage("Zadaj prosím dátum udalosti.")
            .Must(d => DateOnly.TryParseExact(d, "yyyy-MM-dd", out _))
            .WithMessage("Dátum musí byť vo formáte yyyy-MM-dd.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Zadaj prosím názov udalosti.")
            .MaximumLength(300).WithMessage("Názov udalosti môže mať maximálne 300 znakov.");
    }
}

public class CreateLoveStoryEventCommandHandler : IRequestHandler<CreateLoveStoryEventCommand, LoveStoryEventDto>
{
    private readonly ILoveStoryRepository _repo;

    public CreateLoveStoryEventCommandHandler(ILoveStoryRepository repo) => _repo = repo;

    public async Task<LoveStoryEventDto> Handle(CreateLoveStoryEventCommand request, CancellationToken ct)
    {
        var eventDate = DateOnly.ParseExact(request.EventDate, "yyyy-MM-dd");

        var entity = new LoveStoryEvent
        {
            EventDate = eventDate,
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            DisplayOrder = request.DisplayOrder,
        };

        await _repo.AddAsync(entity, ct);

        return new LoveStoryEventDto(
            entity.Id,
            entity.EventDate.ToString("yyyy-MM-dd"),
            entity.Title,
            entity.Description,
            entity.PhotoUrl,
            entity.DisplayOrder);
    }
}
