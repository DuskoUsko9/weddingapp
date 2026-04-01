using FluentValidation;
using MediatR;
using WeddingApp.Application.LoveStory.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.LoveStory.Commands;

public record UpdateLoveStoryEventCommand(
    Guid Id,
    string EventDate,
    string Title,
    string? Description,
    int DisplayOrder) : IRequest<LoveStoryEventDto?>;

public class UpdateLoveStoryEventCommandValidator : AbstractValidator<UpdateLoveStoryEventCommand>
{
    public UpdateLoveStoryEventCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.EventDate)
            .NotEmpty().WithMessage("Zadaj prosím dátum udalosti.")
            .Must(d => DateOnly.TryParseExact(d, "yyyy-MM-dd", out _))
            .WithMessage("Dátum musí byť vo formáte yyyy-MM-dd.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Zadaj prosím názov udalosti.")
            .MaximumLength(300).WithMessage("Názov udalosti môže mať maximálne 300 znakov.");
    }
}

public class UpdateLoveStoryEventCommandHandler : IRequestHandler<UpdateLoveStoryEventCommand, LoveStoryEventDto?>
{
    private readonly ILoveStoryRepository _repo;

    public UpdateLoveStoryEventCommandHandler(ILoveStoryRepository repo) => _repo = repo;

    public async Task<LoveStoryEventDto?> Handle(UpdateLoveStoryEventCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct);
        if (entity is null) return null;

        entity.EventDate = DateOnly.ParseExact(request.EventDate, "yyyy-MM-dd");
        entity.Title = request.Title.Trim();
        entity.Description = request.Description?.Trim();
        entity.DisplayOrder = request.DisplayOrder;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, ct);

        return new LoveStoryEventDto(
            entity.Id,
            entity.EventDate.ToString("yyyy-MM-dd"),
            entity.Title,
            entity.Description,
            entity.PhotoUrl,
            entity.DisplayOrder);
    }
}
