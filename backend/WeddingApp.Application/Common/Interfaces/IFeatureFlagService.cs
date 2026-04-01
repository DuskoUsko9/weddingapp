namespace WeddingApp.Application.Common.Interfaces;

public interface IFeatureFlagService
{
    Task<bool> IsEnabledAsync(string key, string? role = null, CancellationToken ct = default);
}
