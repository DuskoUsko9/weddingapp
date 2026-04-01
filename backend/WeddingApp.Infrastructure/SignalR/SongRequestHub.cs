using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace WeddingApp.Infrastructure.SignalR;

[Authorize]
public class SongRequestHub : Hub
{
    private const string DjGroup = "dj";

    public override async Task OnConnectedAsync()
    {
        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

        // DJ and Admin join the DJ group to receive real-time request notifications
        if (role is "DJ" or "Admin")
            await Groups.AddToGroupAsync(Context.ConnectionId, DjGroup);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, DjGroup);
        await base.OnDisconnectedAsync(exception);
    }
}
