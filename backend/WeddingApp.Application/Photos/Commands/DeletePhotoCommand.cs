using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Photos.Commands;

public record DeletePhotoCommand(Guid PhotoId, Guid RequestingGuestId, bool IsAdmin) : IRequest<bool>;

public class DeletePhotoCommandHandler : IRequestHandler<DeletePhotoCommand, bool>
{
    private readonly IPhotoRepository _repo;
    private readonly IFileStorageService _storage;

    public DeletePhotoCommandHandler(IPhotoRepository repo, IFileStorageService storage)
    {
        _repo = repo;
        _storage = storage;
    }

    public async Task<bool> Handle(DeletePhotoCommand request, CancellationToken ct)
    {
        var photo = await _repo.GetByIdAsync(request.PhotoId, ct);
        if (photo is null) return false;

        // Guest can only delete their own photos
        if (!request.IsAdmin && photo.GuestId != request.RequestingGuestId)
            return false;

        await _storage.DeleteAsync(photo.Url, ct);
        await _repo.DeleteAsync(photo, ct);
        return true;
    }
}
