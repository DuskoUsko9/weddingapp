using MediatR;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.LoveStory.Commands;

public record DeleteLoveStoryEventCommand(Guid Id) : IRequest<bool>;

public class DeleteLoveStoryEventCommandHandler : IRequestHandler<DeleteLoveStoryEventCommand, bool>
{
    private readonly ILoveStoryRepository _repo;

    public DeleteLoveStoryEventCommandHandler(ILoveStoryRepository repo) => _repo = repo;

    public async Task<bool> Handle(DeleteLoveStoryEventCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct);
        if (entity is null) return false;

        await _repo.DeleteAsync(entity, ct);
        return true;
    }
}
