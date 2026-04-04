using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IBingoChallengeRepository
{
    Task<IReadOnlyList<BingoChallenge>> GetAllAsync(CancellationToken ct = default);
    Task<BingoChallenge?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(BingoChallenge challenge, CancellationToken ct = default);
    Task UpdateAsync(BingoChallenge challenge, CancellationToken ct = default);
    Task DeleteAsync(BingoChallenge challenge, CancellationToken ct = default);
}
