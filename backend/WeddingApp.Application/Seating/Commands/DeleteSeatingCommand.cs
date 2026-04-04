using MediatR;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Seating.Commands;

public record DeleteSeatingCommand(Guid GuestId) : IRequest<bool>;

public class DeleteSeatingCommandHandler : IRequestHandler<DeleteSeatingCommand, bool>
{
    private readonly ISeatingRepository _repo;

    public DeleteSeatingCommandHandler(ISeatingRepository repo) => _repo = repo;

    public async Task<bool> Handle(DeleteSeatingCommand request, CancellationToken ct)
    {
        var existing = await _repo.GetByGuestIdAsync(request.GuestId, ct);
        if (existing is null) return false;
        await _repo.DeleteAsync(existing, ct);
        return true;
    }
}
