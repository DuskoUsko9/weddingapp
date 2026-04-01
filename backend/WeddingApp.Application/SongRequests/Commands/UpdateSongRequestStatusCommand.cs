using FluentValidation;
using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.SongRequests.DTOs;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.SongRequests.Commands;

public record UpdateSongRequestStatusCommand(Guid Id, string Status) : IRequest<SongRequestDto?>;

public class UpdateSongRequestStatusCommandValidator : AbstractValidator<UpdateSongRequestStatusCommand>
{
    private static readonly string[] ValidStatuses = ["Played", "Skipped"];

    public UpdateSongRequestStatusCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Status)
            .Must(s => ValidStatuses.Contains(s, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Stav musí byť 'Played' alebo 'Skipped'.");
    }
}

public class UpdateSongRequestStatusCommandHandler : IRequestHandler<UpdateSongRequestStatusCommand, SongRequestDto?>
{
    private readonly ISongRequestRepository _repo;
    private readonly ISongRequestNotifier _notifier;

    public UpdateSongRequestStatusCommandHandler(ISongRequestRepository repo, ISongRequestNotifier notifier)
    {
        _repo = repo;
        _notifier = notifier;
    }

    public async Task<SongRequestDto?> Handle(UpdateSongRequestStatusCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct);
        if (entity is null) return null;

        entity.Status = Enum.Parse<SongRequestStatus>(request.Status, ignoreCase: true);
        entity.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(entity, ct);

        var dto = new SongRequestDto(
            entity.Id, entity.SongName, entity.Artist, entity.Dedication,
            entity.Guest?.FullName ?? string.Empty, entity.GuestId,
            entity.Status.ToString(), entity.CreatedAt);

        await _notifier.NotifyStatusChangedAsync(dto, ct);
        return dto;
    }
}
