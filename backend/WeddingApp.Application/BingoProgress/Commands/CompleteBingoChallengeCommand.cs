using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Common.Models;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.BingoProgress.Commands;

public record CompleteBingoChallengeCommand(
    Guid GuestId,
    Guid ChallengeId,
    Stream? PhotoStream,
    string? PhotoFileName,
    string? PhotoContentType) : IRequest<Result<string>>;

public class CompleteBingoChallengeCommandHandler : IRequestHandler<CompleteBingoChallengeCommand, Result<string>>
{
    private readonly IGuestBingoProgressRepository _repo;
    private readonly IBingoChallengeRepository _challengeRepo;
    private readonly IFileStorageService _storage;

    public CompleteBingoChallengeCommandHandler(
        IGuestBingoProgressRepository repo,
        IBingoChallengeRepository challengeRepo,
        IFileStorageService storage)
    {
        _repo = repo;
        _challengeRepo = challengeRepo;
        _storage = storage;
    }

    public async Task<Result<string>> Handle(CompleteBingoChallengeCommand request, CancellationToken ct)
    {
        var challenge = await _challengeRepo.GetByIdAsync(request.ChallengeId, ct);
        if (challenge is null || !challenge.IsActive)
            return Result<string>.Failure("Výzva nebola nájdená.");

        var existing = await _repo.GetByGuestAndChallengeAsync(request.GuestId, request.ChallengeId, ct);
        if (existing is not null)
            return Result<string>.Failure("Táto výzva je už splnená.");

        string? photoUrl = null;
        if (request.PhotoStream is not null && request.PhotoFileName is not null)
        {
            photoUrl = await _storage.SaveAsync(
                request.PhotoStream, request.PhotoFileName,
                request.PhotoContentType ?? "image/jpeg", ct);
        }

        var progress = new GuestBingoProgress
        {
            GuestId = request.GuestId,
            ChallengeId = request.ChallengeId,
            PhotoUrl = photoUrl,
            CompletedAt = DateTime.UtcNow,
        };
        await _repo.AddAsync(progress, ct);

        return Result<string>.Success(photoUrl ?? string.Empty);
    }
}
