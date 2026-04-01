using FluentValidation;
using MediatR;
using WeddingApp.Application.StaticContent.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.StaticContent.Commands;

public record UpdateStaticContentCommand(
    string Key,
    string Title,
    string Content,
    string? Metadata) : IRequest<StaticContentDto?>;

public class UpdateStaticContentCommandValidator : AbstractValidator<UpdateStaticContentCommand>
{
    public UpdateStaticContentCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty().WithMessage("Kľúč obsahu je povinný.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Zadaj prosím názov obsahu.")
            .MaximumLength(300).WithMessage("Názov obsahu môže mať maximálne 300 znakov.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Obsah nesmie byť prázdny.");
    }
}

public class UpdateStaticContentCommandHandler : IRequestHandler<UpdateStaticContentCommand, StaticContentDto?>
{
    private readonly IStaticContentRepository _repo;

    public UpdateStaticContentCommandHandler(IStaticContentRepository repo) => _repo = repo;

    public async Task<StaticContentDto?> Handle(UpdateStaticContentCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByKeyAsync(request.Key, ct);
        if (entity is null) return null;

        entity.Title = request.Title.Trim();
        entity.Content = request.Content.Trim();
        entity.Metadata = request.Metadata?.Trim();
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, ct);

        return new StaticContentDto(entity.Id, entity.Key, entity.Title, entity.Content, entity.Metadata);
    }
}
