using FluentValidation;
using MediatR;
using WeddingApp.Application.Menu.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Menu.Commands;

public record CreateMenuItemCommand(
    Guid SectionId,
    string Name,
    string? Description,
    int DisplayOrder) : IRequest<MenuItemDto?>;

public class CreateMenuItemCommandValidator : AbstractValidator<CreateMenuItemCommand>
{
    public CreateMenuItemCommandValidator()
    {
        RuleFor(x => x.SectionId).NotEmpty();

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Zadaj prosím názov položky.")
            .MaximumLength(300).WithMessage("Názov položky môže mať maximálne 300 znakov.");
    }
}

public class CreateMenuItemCommandHandler : IRequestHandler<CreateMenuItemCommand, MenuItemDto?>
{
    private readonly IMenuRepository _repo;

    public CreateMenuItemCommandHandler(IMenuRepository repo) => _repo = repo;

    public async Task<MenuItemDto?> Handle(CreateMenuItemCommand request, CancellationToken ct)
    {
        var section = await _repo.GetSectionByIdAsync(request.SectionId, ct);
        if (section is null) return null;

        var entity = new MenuItem
        {
            SectionId = request.SectionId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            DisplayOrder = request.DisplayOrder,
        };

        await _repo.AddItemAsync(entity, ct);

        return new MenuItemDto(entity.Id, entity.SectionId, entity.Name, entity.Description, entity.DisplayOrder);
    }
}
