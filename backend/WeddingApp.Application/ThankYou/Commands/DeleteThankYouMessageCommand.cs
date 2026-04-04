using MediatR;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.ThankYou.Commands;

public record DeleteThankYouMessageCommand(Guid GuestId) : IRequest<bool>;

public class DeleteThankYouMessageCommandHandler : IRequestHandler<DeleteThankYouMessageCommand, bool>
{
    private readonly IThankYouMessageRepository _repo;

    public DeleteThankYouMessageCommandHandler(IThankYouMessageRepository repo) => _repo = repo;

    public async Task<bool> Handle(DeleteThankYouMessageCommand request, CancellationToken ct)
    {
        var existing = await _repo.GetByGuestIdAsync(request.GuestId, ct);
        if (existing is null) return false;
        await _repo.DeleteAsync(existing, ct);
        return true;
    }
}
