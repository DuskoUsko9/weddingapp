using FluentValidation;
using MediatR;
using WeddingApp.Application.Auth.DTOs;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Auth.Commands;

public record LoginCommand(string Name) : IRequest<LoginResult>;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Zadaj prosím svoje meno.")
            .MinimumLength(2).WithMessage("Meno musí mať aspoň 2 znaky.")
            .MaximumLength(200).WithMessage("Meno je príliš dlhé.");
    }
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly IGuestRepository _guests;
    private readonly IJwtService _jwt;

    // Special login tokens mapped to roles — no guest record needed
    private static readonly Dictionary<string, (UserRole Role, string DisplayName)> SpecialTokens = new(
        StringComparer.OrdinalIgnoreCase)
    {
        ["maduadmin"] = (UserRole.Admin, "Admin"),
        ["djmiles"]   = (UserRole.DJ, "DJ Miles"),
        ["starejsi"]  = (UserRole.MasterOfCeremony, "Starejší"),
    };

    public LoginCommandHandler(IGuestRepository guests, IJwtService jwt)
    {
        _guests = guests;
        _jwt = jwt;
    }

    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken ct)
    {
        var name = request.Name.Trim();

        // Check special tokens first (exact match, case-insensitive)
        if (SpecialTokens.TryGetValue(name, out var special))
        {
            var token = _jwt.GenerateToken(null, special.DisplayName, special.Role);
            return LoginResult.Token(token, special.Role, null, special.DisplayName);
        }

        // Search guest list by normalized name (trigram similarity)
        var normalized = NormalizeName(name);
        var matches = await _guests.SearchByNameAsync(normalized, ct);

        return matches.Count switch
        {
            0 => LoginResult.NotFound(),
            1 => LoginResult.Token(
                    _jwt.GenerateToken(matches[0].Id, matches[0].FullName, UserRole.Guest),
                    UserRole.Guest,
                    matches[0].Id,
                    matches[0].FullName),
            _ => LoginResult.Disambiguation(
                    matches.Select(g => new GuestMatch(g.Id, g.FullName, g.Category.ToString(), g.Side.ToString()))
                           .ToList())
        };
    }

    // Normalize Slovak name for search: lowercase, remove diacritics approximation
    // Full unaccent happens in DB via pg_trgm — this is client-side pre-filter
    public static string NormalizeName(string name) =>
        name.Trim().ToLowerInvariant();
}
