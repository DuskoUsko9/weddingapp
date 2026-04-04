namespace WeddingApp.Application.Common.Interfaces;

public interface IFileStorageService
{
    /// <summary>Saves a file stream and returns the publicly accessible URL.</summary>
    Task<string> SaveAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default);

    /// <summary>Deletes a file by its URL. No-op if the URL is not managed by this service.</summary>
    Task DeleteAsync(string url, CancellationToken ct = default);
}
