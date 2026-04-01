using WeddingApp.Application.SongRequests.DTOs;

namespace WeddingApp.Application.Common.Interfaces;

public interface ISongRequestNotifier
{
    Task NotifyNewRequestAsync(SongRequestDto request, CancellationToken ct = default);
    Task NotifyStatusChangedAsync(SongRequestDto request, CancellationToken ct = default);
}
