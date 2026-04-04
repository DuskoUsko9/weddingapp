using FluentValidation;
using MediatR;
using WeddingApp.Application.BingoChallenges.DTOs;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.BingoChallenges.Commands;

public record CreateBingoChallengeCommand(string Title, string? Description, int DisplayOrder, bool IsActive) : IRequest<BingoChallengeDto>;

public class CreateBingoChallengeCommandValidator : AbstractValidator<CreateBingoChallengeCommand>
{
    public CreateBingoChallengeCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}

public class CreateBingoChallengeCommandHandler : IRequestHandler<CreateBingoChallengeCommand, BingoChallengeDto>
{
    private readonly IBingoChallengeRepository _repo;

    public CreateBingoChallengeCommandHandler(IBingoChallengeRepository repo) => _repo = repo;

    public async Task<BingoChallengeDto> Handle(CreateBingoChallengeCommand request, CancellationToken ct)
    {
        var entity = new BingoChallenge
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
        };
        await _repo.AddAsync(entity, ct);
        return new BingoChallengeDto(entity.Id, entity.Title, entity.Description, entity.DisplayOrder, entity.IsActive);
    }
}
