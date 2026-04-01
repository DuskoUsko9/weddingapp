using WeddingApp.Domain.Enums;

namespace WeddingApp.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid? GuestId { get; }
    string? Name { get; }
    UserRole? Role { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
    bool IsDJ { get; }
    bool IsMasterOfCeremony { get; }
}
