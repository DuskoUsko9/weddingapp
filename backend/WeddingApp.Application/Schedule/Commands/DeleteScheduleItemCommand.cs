using MediatR;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Schedule.Commands;

public record DeleteScheduleItemCommand(Guid Id) : IRequest<bool>;

public class DeleteScheduleItemCommandHandler : IRequestHandler<DeleteScheduleItemCommand, bool>
{
    private readonly IScheduleRepository _repo;

    public DeleteScheduleItemCommandHandler(IScheduleRepository repo) => _repo = repo;

    public async Task<bool> Handle(DeleteScheduleItemCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct);
        if (entity is null) return false;

        await _repo.DeleteAsync(entity, ct);
        return true;
    }
}
