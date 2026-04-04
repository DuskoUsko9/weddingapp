using MediatR;
using WeddingApp.Application.Common.Models;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Admin.Commands;

public record UpdateGuestEmailCommand(Guid GuestId, string? Email) : IRequest<Result>;

public class UpdateGuestEmailCommandHandler : IRequestHandler<UpdateGuestEmailCommand, Result>
{
    private readonly IGuestRepository _guests;

    public UpdateGuestEmailCommandHandler(IGuestRepository guests) => _guests = guests;

    public async Task<Result> Handle(UpdateGuestEmailCommand request, CancellationToken ct)
    {
        var guest = await _guests.GetByIdAsync(request.GuestId, ct);
        if (guest is null)
            return Result.Failure("Hosť nenájdený.");

        guest.Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        await _guests.UpdateAsync(guest, ct);
        return Result.Success();
    }
}
