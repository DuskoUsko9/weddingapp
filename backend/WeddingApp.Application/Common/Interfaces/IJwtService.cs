using WeddingApp.Domain.Enums;

namespace WeddingApp.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(Guid? guestId, string name, UserRole role, bool testSession = false);
}
