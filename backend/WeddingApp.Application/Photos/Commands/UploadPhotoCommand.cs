using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Common.Models;
using WeddingApp.Application.Photos.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Photos.Commands;

public record UploadPhotoCommand(
    Guid GuestId,
    Stream FileStream,
    string FileName,
    string ContentType,
    long FileSizeBytes) : IRequest<Result<PhotoDto>>;

public class UploadPhotoCommandHandler : IRequestHandler<UploadPhotoCommand, Result<PhotoDto>>
{
    private readonly IPhotoRepository _repo;
    private readonly IFileStorageService _storage;

    public UploadPhotoCommandHandler(IPhotoRepository repo, IFileStorageService storage)
    {
        _repo = repo;
        _storage = storage;
    }

    public async Task<Result<PhotoDto>> Handle(UploadPhotoCommand request, CancellationToken ct)
    {
        const long maxBytes = 10 * 1024 * 1024; // 10 MB
        if (request.FileSizeBytes > maxBytes)
            return Result<PhotoDto>.Failure("Fotka nesmie byť väčšia ako 10 MB.");

        var url = await _storage.SaveAsync(request.FileStream, request.FileName, request.ContentType, ct);

        var photo = new GuestPhoto
        {
            GuestId = request.GuestId,
            FileName = request.FileName,
            Url = url,
            FileSizeBytes = request.FileSizeBytes,
        };
        await _repo.AddAsync(photo, ct);

        return Result<PhotoDto>.Success(
            new PhotoDto(photo.Id, photo.GuestId, string.Empty, photo.Url, photo.FileSizeBytes, photo.CreatedAt));
    }
}
