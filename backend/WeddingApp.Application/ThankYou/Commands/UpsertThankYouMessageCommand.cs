using FluentValidation;
using MediatR;
using WeddingApp.Application.Common.Models;
using WeddingApp.Application.ThankYou.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.ThankYou.Commands;

public record UpsertThankYouMessageCommand(
    Guid GuestId,
    string Message,
    string? PhotoUrl) : IRequest<Result<ThankYouDto>>;

public class UpsertThankYouMessageCommandValidator : AbstractValidator<UpsertThankYouMessageCommand>
{
    public UpsertThankYouMessageCommandValidator()
    {
        RuleFor(x => x.Message).NotEmpty().MaximumLength(2000);
    }
}

public class UpsertThankYouMessageCommandHandler : IRequestHandler<UpsertThankYouMessageCommand, Result<ThankYouDto>>
{
    private readonly IThankYouMessageRepository _repo;
    private readonly IGuestRepository _guestRepo;

    public UpsertThankYouMessageCommandHandler(IThankYouMessageRepository repo, IGuestRepository guestRepo)
    {
        _repo = repo;
        _guestRepo = guestRepo;
    }

    public async Task<Result<ThankYouDto>> Handle(UpsertThankYouMessageCommand request, CancellationToken ct)
    {
        var guest = await _guestRepo.GetByIdAsync(request.GuestId, ct);
        if (guest is null)
            return Result<ThankYouDto>.Failure("Hosť nebol nájdený.");

        var existing = await _repo.GetByGuestIdAsync(request.GuestId, ct);
        if (existing is not null)
        {
            existing.Message = request.Message.Trim();
            existing.PhotoUrl = request.PhotoUrl;
            existing.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(existing, ct);
            return Result<ThankYouDto>.Success(
                new ThankYouDto(existing.GuestId, guest.FullName, existing.Message, existing.PhotoUrl));
        }

        var msg = new ThankYouMessage
        {
            GuestId = request.GuestId,
            Message = request.Message.Trim(),
            PhotoUrl = request.PhotoUrl,
        };
        await _repo.AddAsync(msg, ct);
        return Result<ThankYouDto>.Success(
            new ThankYouDto(msg.GuestId, guest.FullName, msg.Message, msg.PhotoUrl));
    }
}
