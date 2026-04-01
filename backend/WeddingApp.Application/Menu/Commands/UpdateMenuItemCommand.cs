using FluentValidation;
using MediatR;
using WeddingApp.Application.Menu.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Menu.Commands;

public record UpdateMenuItemCommand(
    Guid Id,
    string Name,
    string? Description,
    int DisplayOrder) : IRequest<MenuItemDto?>;

public class UpdateMenuItemCommandValidator : AbstractValidator<UpdateMenuItemCommand>
{
    public UpdateMenuItemCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Zadaj prosím názov položky.")
            .MaximumLength(300).WithMessage("Názov položky môže mať maximálne 300 znakov.");
    }
}

public class UpdateMenuItemCommandHandler : IRequestHandler<UpdateMenuItemCommand, MenuItemDto?>
{
    private readonly IMenuRepository _repo;

    public UpdateMenuItemCommandHandler(IMenuRepository repo) => _repo = repo;

    public async Task<MenuItemDto?> Handle(UpdateMenuItemCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetItemByIdAsync(request.Id, ct);
        if (entity is null) return null;

        entity.Name = request.Name.Trim();
        entity.Description = request.Description?.Trim();
        entity.DisplayOrder = request.DisplayOrder;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateItemAsync(entity, ct);

        return new MenuItemDto(entity.Id, entity.SectionId, entity.Name, entity.Description, entity.DisplayOrder);
    }
}
