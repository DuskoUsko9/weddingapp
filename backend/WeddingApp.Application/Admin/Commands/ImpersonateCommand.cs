using MediatR;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Application.Common.Models;
using WeddingApp.Domain.Enums;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Admin.Commands;

public record ImpersonateCommand(Guid? GuestId, string? Role) : IRequest<Result<string>>;

public class ImpersonateCommandHandler : IRequestHandler<ImpersonateCommand, Result<string>>
{
    private readonly IGuestRepository _guestRepo;
    private readonly IJwtService _jwtService;

    public ImpersonateCommandHandler(IGuestRepository guestRepo, IJwtService jwtService)
    {
        _guestRepo = guestRepo;
        _jwtService = jwtService;
    }

    public async Task<Result<string>> Handle(ImpersonateCommand request, CancellationToken ct)
    {
        if (request.GuestId.HasValue)
        {
            var guest = await _guestRepo.GetByIdAsync(request.GuestId.Value, ct);
            if (guest is null)
                return Result<string>.Failure("Hosť nebol nájdený.");

            var token = _jwtService.GenerateToken(guest.Id, guest.FullName, UserRole.Guest, testSession: true);
            return Result<string>.Success(token);
        }

        if (!string.IsNullOrEmpty(request.Role))
        {
            if (!Enum.TryParse<UserRole>(request.Role, out var role) ||
                role is UserRole.Admin or UserRole.Guest)
                return Result<string>.Failure("Neplatná rola pre impersonáciu.");

            var displayName = role switch
            {
                UserRole.DJ => "djmiles",
                UserRole.MasterOfCeremony => "starejsi",
                _ => role.ToString()
            };

            var token = _jwtService.GenerateToken(null, displayName, role, testSession: true);
            return Result<string>.Success(token);
        }

        return Result<string>.Failure("Musí byť zadaný guestId alebo role.");
    }
}
