using MediatR;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Menu.Commands;

public record DeleteMenuSectionCommand(Guid Id) : IRequest<bool>;

public class DeleteMenuSectionCommandHandler : IRequestHandler<DeleteMenuSectionCommand, bool>
{
    private readonly IMenuRepository _repo;

    public DeleteMenuSectionCommandHandler(IMenuRepository repo) => _repo = repo;

    public async Task<bool> Handle(DeleteMenuSectionCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetSectionByIdAsync(request.Id, ct);
        if (entity is null) return false;

        await _repo.DeleteSectionAsync(entity, ct);
        return true;
    }
}
