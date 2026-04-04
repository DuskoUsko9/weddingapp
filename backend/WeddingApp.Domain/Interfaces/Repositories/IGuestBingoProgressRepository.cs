using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IGuestBingoProgressRepository
{
    Task<IReadOnlyList<GuestBingoProgress>> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default);
    Task<GuestBingoProgress?> GetByGuestAndChallengeAsync(Guid guestId, Guid challengeId, CancellationToken ct = default);
    Task AddAsync(GuestBingoProgress progress, CancellationToken ct = default);
    Task DeleteAsync(GuestBingoProgress progress, CancellationToken ct = default);
}
