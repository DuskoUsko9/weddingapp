using Microsoft.AspNetCore.SignalR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.SongRequests.DTOs;
using WeddingApp.Infrastructure.SignalR;

namespace WeddingApp.Infrastructure.Services;

public class SongRequestNotifier : ISongRequestNotifier
{
    private readonly IHubContext<SongRequestHub> _hubContext;

    public SongRequestNotifier(IHubContext<SongRequestHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyNewRequestAsync(SongRequestDto request, CancellationToken ct = default) =>
        await _hubContext.Clients.Group("dj").SendAsync("NewSongRequest", request, ct);

    public async Task NotifyStatusChangedAsync(SongRequestDto request, CancellationToken ct = default) =>
        await _hubContext.Clients.Group("dj").SendAsync("SongRequestUpdated", request, ct);
}
