using WeddingApp.Domain.Enums;

namespace WeddingApp.Application.Auth.DTOs;

public enum LoginResultType { Token, Disambiguation, NotFound, Error }

public record GuestMatch(Guid GuestId, string FullName, string Category, string Side);

public class LoginResult
{
    public LoginResultType Type { get; init; }
    public string? JwtToken { get; init; }
    public UserRole? Role { get; init; }
    public Guid? GuestId { get; init; }
    public string? GuestName { get; init; }
    public IReadOnlyList<GuestMatch>? Matches { get; init; }
    public string? ErrorMessage { get; init; }

    public static LoginResult Token(string token, UserRole role, Guid? guestId, string guestName) =>
        new() { Type = LoginResultType.Token, JwtToken = token, Role = role, GuestId = guestId, GuestName = guestName };

    public static LoginResult Disambiguation(IReadOnlyList<GuestMatch> matches) =>
        new() { Type = LoginResultType.Disambiguation, Matches = matches };

    public static LoginResult NotFound() =>
        new() { Type = LoginResultType.NotFound };

    public static LoginResult Error(string message) =>
        new() { Type = LoginResultType.Error, ErrorMessage = message };
}
