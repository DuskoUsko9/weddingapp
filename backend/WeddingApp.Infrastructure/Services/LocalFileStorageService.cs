using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using WeddingApp.Application.Common.Interfaces;

namespace WeddingApp.Infrastructure.Services;

/// <summary>
/// Development file storage — saves files to wwwroot/uploads/ and serves them as static files.
/// Replace with AzureBlobStorageService for production.
/// </summary>
public class LocalFileStorageService : IFileStorageService
{
    private readonly string _uploadsPath;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LocalFileStorageService(IHostEnvironment env, IHttpContextAccessor httpContextAccessor)
    {
        _uploadsPath = Path.Combine(env.ContentRootPath, "wwwroot", "uploads");
        _httpContextAccessor = httpContextAccessor;
        Directory.CreateDirectory(_uploadsPath);
    }

    public async Task<string> SaveAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default)
    {
        var ext = Path.GetExtension(fileName);
        var uniqueName = $"{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(_uploadsPath, uniqueName);

        await using var fileStream = File.Create(filePath);
        await stream.CopyToAsync(fileStream, ct);

        var ctx = _httpContextAccessor.HttpContext;
        var baseUrl = ctx is not null
            ? $"{ctx.Request.Scheme}://{ctx.Request.Host}"
            : string.Empty;

        return $"{baseUrl}/uploads/{uniqueName}";
    }

    public Task DeleteAsync(string url, CancellationToken ct = default)
    {
        // Extract filename from URL — only delete files managed here
        var fileName = url.Split('/').LastOrDefault();
        if (!string.IsNullOrEmpty(fileName))
        {
            var filePath = Path.Combine(_uploadsPath, fileName);
            if (File.Exists(filePath))
                File.Delete(filePath);
        }
        return Task.CompletedTask;
    }
}
