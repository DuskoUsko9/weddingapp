using MediatR;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.BingoChallenges.Commands;

public record DeleteBingoChallengeCommand(Guid Id) : IRequest<bool>;

public class DeleteBingoChallengeCommandHandler : IRequestHandler<DeleteBingoChallengeCommand, bool>
{
    private readonly IBingoChallengeRepository _repo;

    public DeleteBingoChallengeCommandHandler(IBingoChallengeRepository repo) => _repo = repo;

    public async Task<bool> Handle(DeleteBingoChallengeCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct);
        if (entity is null) return false;
        await _repo.DeleteAsync(entity, ct);
        return true;
    }
}
