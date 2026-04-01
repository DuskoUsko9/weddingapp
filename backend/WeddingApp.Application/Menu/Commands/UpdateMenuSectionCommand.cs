using FluentValidation;
using MediatR;
using WeddingApp.Application.Menu.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Menu.Commands;

public record UpdateMenuSectionCommand(
    Guid Id,
    string Name,
    int DisplayOrder) : IRequest<MenuSectionDto?>;

public class UpdateMenuSectionCommandValidator : AbstractValidator<UpdateMenuSectionCommand>
{
    public UpdateMenuSectionCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Zadaj prosím názov sekcie.")
            .MaximumLength(300).WithMessage("Názov sekcie môže mať maximálne 300 znakov.");
    }
}

public class UpdateMenuSectionCommandHandler : IRequestHandler<UpdateMenuSectionCommand, MenuSectionDto?>
{
    private readonly IMenuRepository _repo;

    public UpdateMenuSectionCommandHandler(IMenuRepository repo) => _repo = repo;

    public async Task<MenuSectionDto?> Handle(UpdateMenuSectionCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetSectionByIdAsync(request.Id, ct);
        if (entity is null) return null;

        entity.Name = request.Name.Trim();
        entity.DisplayOrder = request.DisplayOrder;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateSectionAsync(entity, ct);

        var items = entity.Items
            .OrderBy(i => i.DisplayOrder)
            .Select(i => new MenuItemDto(i.Id, i.SectionId, i.Name, i.Description, i.DisplayOrder))
            .ToList();

        return new MenuSectionDto(entity.Id, entity.Name, entity.DisplayOrder, items);
    }
}
