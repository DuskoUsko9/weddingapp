using MediatR;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Menu.Commands;

public record DeleteMenuItemCommand(Guid Id) : IRequest<bool>;

public class DeleteMenuItemCommandHandler : IRequestHandler<DeleteMenuItemCommand, bool>
{
    private readonly IMenuRepository _repo;

    public DeleteMenuItemCommandHandler(IMenuRepository repo) => _repo = repo;

    public async Task<bool> Handle(DeleteMenuItemCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetItemByIdAsync(request.Id, ct);
        if (entity is null) return false;

        await _repo.DeleteItemAsync(entity, ct);
        return true;
    }
}
