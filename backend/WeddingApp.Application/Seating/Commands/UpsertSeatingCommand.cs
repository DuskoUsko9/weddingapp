using FluentValidation;
using MediatR;
using WeddingApp.Application.Common.Models;
using WeddingApp.Application.Seating.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.Seating.Commands;

public record UpsertSeatingCommand(
    Guid GuestId,
    int TableNumber,
    string? TableName,
    string? SeatNote) : IRequest<Result<SeatingDto>>;

public class UpsertSeatingCommandValidator : AbstractValidator<UpsertSeatingCommand>
{
    public UpsertSeatingCommandValidator()
    {
        RuleFor(x => x.TableNumber).GreaterThan(0);
        RuleFor(x => x.TableName).MaximumLength(100);
        RuleFor(x => x.SeatNote).MaximumLength(200);
    }
}

public class UpsertSeatingCommandHandler : IRequestHandler<UpsertSeatingCommand, Result<SeatingDto>>
{
    private readonly ISeatingRepository _repo;
    private readonly IGuestRepository _guestRepo;

    public UpsertSeatingCommandHandler(ISeatingRepository repo, IGuestRepository guestRepo)
    {
        _repo = repo;
        _guestRepo = guestRepo;
    }

    public async Task<Result<SeatingDto>> Handle(UpsertSeatingCommand request, CancellationToken ct)
    {
        var guest = await _guestRepo.GetByIdAsync(request.GuestId, ct);
        if (guest is null)
            return Result<SeatingDto>.Failure("Hosť nebol nájdený.");

        var existing = await _repo.GetByGuestIdAsync(request.GuestId, ct);
        if (existing is not null)
        {
            existing.TableNumber = request.TableNumber;
            existing.TableName = request.TableName;
            existing.SeatNote = request.SeatNote;
            existing.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(existing, ct);
            return Result<SeatingDto>.Success(
                new SeatingDto(existing.GuestId, guest.FullName, existing.TableNumber, existing.TableName, existing.SeatNote));
        }

        var assignment = new SeatingAssignment
        {
            GuestId = request.GuestId,
            TableNumber = request.TableNumber,
            TableName = request.TableName,
            SeatNote = request.SeatNote,
        };
        await _repo.AddAsync(assignment, ct);
        return Result<SeatingDto>.Success(
            new SeatingDto(assignment.GuestId, guest.FullName, assignment.TableNumber, assignment.TableName, assignment.SeatNote));
    }
}
