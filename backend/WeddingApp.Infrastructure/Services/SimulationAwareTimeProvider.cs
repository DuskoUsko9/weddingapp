using Microsoft.AspNetCore.Http;
using WeddingApp.Application.Common.Interfaces;

namespace WeddingApp.Infrastructure.Services;

public class SimulationAwareTimeProvider : ITimeProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ICurrentUserService _currentUser;

    public SimulationAwareTimeProvider(
        IHttpContextAccessor httpContextAccessor,
        ICurrentUserService currentUser)
    {
        _httpContextAccessor = httpContextAccessor;
        _currentUser = currentUser;
    }

    public DateTime UtcNow
    {
        get
        {
            var ctx = _httpContextAccessor.HttpContext;
            var isTestSession = ctx?.User.FindFirst("test_session")?.Value == "1";

            if (_currentUser.IsAdmin || isTestSession)
            {
                var header = ctx?.Request.Headers["X-Simulate-Time"].FirstOrDefault();

                if (!string.IsNullOrEmpty(header) &&
                    DateTime.TryParse(header, null,
                        System.Globalization.DateTimeStyles.RoundtripKind,
                        out var simTime))
                {
                    return simTime.ToUniversalTime();
                }
            }

            return DateTime.UtcNow;
        }
    }
}
