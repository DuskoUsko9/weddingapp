using FluentValidation;
using MediatR;
using WeddingApp.Application.Menu.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Menu.Commands;

public record CreateMenuSectionCommand(
    string Name,
    int DisplayOrder) : IRequest<MenuSectionDto>;

public class CreateMenuSectionCommandValidator : AbstractValidator<CreateMenuSectionCommand>
{
    public CreateMenuSectionCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Zadaj prosím názov sekcie.")
            .MaximumLength(300).WithMessage("Názov sekcie môže mať maximálne 300 znakov.");
    }
}

public class CreateMenuSectionCommandHandler : IRequestHandler<CreateMenuSectionCommand, MenuSectionDto>
{
    private readonly IMenuRepository _repo;

    public CreateMenuSectionCommandHandler(IMenuRepository repo) => _repo = repo;

    public async Task<MenuSectionDto> Handle(CreateMenuSectionCommand request, CancellationToken ct)
    {
        var entity = new MenuSection
        {
            Name = request.Name.Trim(),
            DisplayOrder = request.DisplayOrder,
        };

        await _repo.AddSectionAsync(entity, ct);

        return new MenuSectionDto(entity.Id, entity.Name, entity.DisplayOrder, []);
    }
}
