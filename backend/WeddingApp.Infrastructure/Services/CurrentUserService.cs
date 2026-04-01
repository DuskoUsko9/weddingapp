using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    public Guid? GuestId
    {
        get
        {
            var claim = User?.FindFirst("guestId")?.Value;
            return Guid.TryParse(claim, out var id) ? id : null;
        }
    }

    public string? Name => User?.FindFirst(ClaimTypes.Name)?.Value;

    public UserRole? Role
    {
        get
        {
            var claim = User?.FindFirst(ClaimTypes.Role)?.Value;
            return Enum.TryParse<UserRole>(claim, out var role) ? role : null;
        }
    }

    public bool IsAdmin => Role == UserRole.Admin;
    public bool IsDJ => Role == UserRole.DJ;
    public bool IsMasterOfCeremony => Role == UserRole.MasterOfCeremony;
}
