using MediatR;
using WeddingApp.Application.BingoChallenges.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.BingoChallenges.Commands;

public record UpdateBingoChallengeCommand(Guid Id, string Title, string? Description, int DisplayOrder, bool IsActive) : IRequest<BingoChallengeDto?>;

public class UpdateBingoChallengeCommandHandler : IRequestHandler<UpdateBingoChallengeCommand, BingoChallengeDto?>
{
    private readonly IBingoChallengeRepository _repo;

    public UpdateBingoChallengeCommandHandler(IBingoChallengeRepository repo) => _repo = repo;

    public async Task<BingoChallengeDto?> Handle(UpdateBingoChallengeCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct);
        if (entity is null) return null;

        entity.Title = request.Title.Trim();
        entity.Description = request.Description?.Trim();
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;

        await _repo.UpdateAsync(entity, ct);
        return new BingoChallengeDto(entity.Id, entity.Title, entity.Description, entity.DisplayOrder, entity.IsActive);
    }
}
