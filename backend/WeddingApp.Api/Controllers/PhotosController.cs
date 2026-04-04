using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Photos.Commands;
using WeddingApp.Application.Photos.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class PhotosController : BaseController
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;
    private readonly IFeatureFlagService _features;

    public PhotosController(IMediator mediator, ICurrentUserService currentUser, IFeatureFlagService features)
    {
        _mediator = mediator;
        _currentUser = currentUser;
        _features = features;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetPhotosQuery(), ct));

    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
    public async Task<IActionResult> Upload(IFormFile file, CancellationToken ct)
    {
        // Feature flag enforcement on backend — admin can always upload
        if (!_currentUser.IsAdmin)
        {
            var enabled = await _features.IsEnabledAsync("photo_upload", _currentUser.Role?.ToString(), ct);
            if (!enabled)
                return ErrorResult("Nahrávanie fotiek ešte nie je dostupné.", 403);
        }

        if (_currentUser.GuestId is null)
            return ErrorResult("Nahrávanie fotiek je dostupné len pre hostí.", 403);

        if (file.Length == 0)
            return ErrorResult("Súbor je prázdny.");

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/heic", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return ErrorResult("Podporované formáty: JPG, PNG, HEIC, WebP.");

        await using var stream = file.OpenReadStream();
        var result = await _mediator.Send(
            new UploadPhotoCommand(_currentUser.GuestId.Value, stream, file.FileName, file.ContentType, file.Length), ct);

        return result.IsSuccess
            ? StatusCode(201, new { data = result.Value, error = (string?)null })
            : ErrorResult(result.Error!);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _mediator.Send(
            new DeletePhotoCommand(id, _currentUser.GuestId ?? Guid.Empty, _currentUser.IsAdmin), ct);
        return deleted ? NoContent() : NotFound(new { data = (object?)null, error = "Nenašlo sa." });
    }
}
