using WeddingApp.Domain.Entities;

namespace WeddingApp.Domain.Interfaces.Repositories;

public interface IQuestionnaireRepository
{
    Task<QuestionnaireResponse?> GetByGuestIdAsync(Guid guestId, CancellationToken ct = default);
    Task<IReadOnlyList<QuestionnaireResponse>> GetAllAsync(CancellationToken ct = default);
    Task<int> CountSubmittedAsync(CancellationToken ct = default);
    Task AddAsync(QuestionnaireResponse response, CancellationToken ct = default);
    Task UpdateAsync(QuestionnaireResponse response, CancellationToken ct = default);
}
