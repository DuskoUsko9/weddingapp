using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IThankYouMessageRepository
{
    Task<ThankYouMessage?> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default);
    Task<IReadOnlyList<ThankYouMessage>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(ThankYouMessage message, CancellationToken ct = default);
    Task UpdateAsync(ThankYouMessage message, CancellationToken ct = default);
    Task DeleteAsync(ThankYouMessage message, CancellationToken ct = default);
}
