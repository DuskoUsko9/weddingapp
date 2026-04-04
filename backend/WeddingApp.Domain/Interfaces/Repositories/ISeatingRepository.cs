using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface ISeatingRepository
{
    Task<SeatingAssignment?> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default);
    Task<IReadOnlyList<SeatingAssignment>> GetByTableNumberAsync(int tableNumber, CancellationToken ct = default);
    Task<IReadOnlyList<SeatingAssignment>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(SeatingAssignment assignment, CancellationToken ct = default);
    Task UpdateAsync(SeatingAssignment assignment, CancellationToken ct = default);
    Task DeleteAsync(SeatingAssignment assignment, CancellationToken ct = default);
}
