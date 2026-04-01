using FluentValidation;
using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.SongRequests.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.SongRequests.Commands;

public record CreateSongRequestCommand(string SongName, string? Artist, string? Dedication) : IRequest<SongRequestDto>;

public class CreateSongRequestCommandValidator : AbstractValidator<CreateSongRequestCommand>
{
    public CreateSongRequestCommandValidator()
    {
        RuleFor(x => x.SongName)
            .NotEmpty().WithMessage("Zadaj názov piesne.")
            .MaximumLength(300).WithMessage("Názov piesne je príliš dlhý.");
        RuleFor(x => x.Artist).MaximumLength(300).WithMessage("Meno interpreta je príliš dlhé.");
        RuleFor(x => x.Dedication).MaximumLength(120).WithMessage("Odkaz môže mať maximálne 120 znakov.");
    }
}

public class CreateSongRequestCommandHandler : IRequestHandler<CreateSongRequestCommand, SongRequestDto>
{
    private readonly ISongRequestRepository _repo;
    private readonly ICurrentUserService _currentUser;
    private readonly ISongRequestNotifier _notifier;

    public CreateSongRequestCommandHandler(
        ISongRequestRepository repo,
        ICurrentUserService currentUser,
        ISongRequestNotifier notifier)
    {
        _repo = repo;
        _currentUser = currentUser;
        _notifier = notifier;
    }

    public async Task<SongRequestDto> Handle(CreateSongRequestCommand request, CancellationToken ct)
    {
        var guestId = _currentUser.GuestId
            ?? throw new InvalidOperationException("Guest ID required for song requests.");

        var entity = new SongRequest
        {
            GuestId = guestId,
            SongName = request.SongName.Trim(),
            Artist = request.Artist?.Trim(),
            Dedication = request.Dedication?.Trim(),
        };

        await _repo.AddAsync(entity, ct);

        var dto = new SongRequestDto(
            entity.Id, entity.SongName, entity.Artist, entity.Dedication,
            _currentUser.Name ?? string.Empty, guestId,
            entity.Status.ToString(), entity.CreatedAt);

        await _notifier.NotifyNewRequestAsync(dto, ct);
        return dto;
    }
}
