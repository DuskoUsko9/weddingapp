using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;
using WeddingApp.Application.Common.Interfaces;

namespace WeddingApp.Infrastructure.Services;

public class AzureBlobStorageService : IFileStorageService
{
    private readonly BlobContainerClient _container;

    public AzureBlobStorageService(IConfiguration configuration)
    {
        var connStr = configuration["Azure:BlobStorage:ConnectionString"]
            ?? throw new InvalidOperationException("Azure:BlobStorage:ConnectionString is not configured.");
        var containerName = configuration["Azure:BlobStorage:ContainerName"] ?? "photos";
        _container = new BlobContainerClient(connStr, containerName);
    }

    public async Task<string> SaveAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default)
    {
        var ext = Path.GetExtension(fileName);
        var blobName = $"{Guid.NewGuid():N}{ext}";
        var blob = _container.GetBlobClient(blobName);

        await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType }, cancellationToken: ct);

        return blob.Uri.ToString();
    }

    public async Task DeleteAsync(string url, CancellationToken ct = default)
    {
        if (Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            var blobName = uri.Segments.LastOrDefault();
            if (!string.IsNullOrEmpty(blobName))
            {
                var blob = _container.GetBlobClient(blobName);
                await blob.DeleteIfExistsAsync(cancellationToken: ct);
            }
        }
    }
}
