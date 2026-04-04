using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Infrastructure.Auth;

public class JwtService : IJwtService
{
    private readonly string _secret;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expiryDays;

    public JwtService(IConfiguration config)
    {
        _secret   = config["Jwt:Secret"]   ?? throw new InvalidOperationException("Jwt:Secret is not configured.");
        _issuer   = config["Jwt:Issuer"]   ?? "WeddingApp";
        _audience = config["Jwt:Audience"] ?? "WeddingAppUsers";
        _expiryDays = int.TryParse(config["Jwt:ExpiryDays"], out var days) ? days : 7;
    }

    public string GenerateToken(Guid? guestId, string name, UserRole role, bool testSession = false)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub,  guestId?.ToString() ?? $"system-{role.ToString().ToLower()}"),
            new(JwtRegisteredClaimNames.Name, name),
            new(ClaimTypes.Role,              role.ToString()),
            new(JwtRegisteredClaimNames.Jti,  Guid.NewGuid().ToString()),
        };

        if (guestId.HasValue)
            claims.Add(new Claim("guestId", guestId.Value.ToString()));

        if (testSession)
            claims.Add(new Claim("test_session", "1"));

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:   _issuer,
            audience: _audience,
            claims:   claims,
            expires:  DateTime.UtcNow.AddDays(_expiryDays),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
