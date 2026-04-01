using FluentValidation;
using MediatR;
using WeddingApp.Application.FeatureFlags.DTOs;
using WeddingApp.Domain.Interfaces.Repositories;

namespace WeddingApp.Application.FeatureFlags.Commands;

public record UpdateFeatureFlagCommand(
    string Key,
    bool? IsManuallyEnabled,
    bool? IsManuallyDisabled,
    DateTime? AvailableFrom,
    DateTime? AvailableUntil) : IRequest<FeatureFlagDto?>;

public class UpdateFeatureFlagCommandValidator : AbstractValidator<UpdateFeatureFlagCommand>
{
    public UpdateFeatureFlagCommandValidator()
    {
        RuleFor(x => x.Key).NotEmpty();
        RuleFor(x => x)
            .Must(x => !(x.IsManuallyEnabled == true && x.IsManuallyDisabled == true))
            .WithMessage("Feature flag nemôže byť zároveň manuálne zapnutý aj vypnutý.");
    }
}

public class UpdateFeatureFlagCommandHandler : IRequestHandler<UpdateFeatureFlagCommand, FeatureFlagDto?>
{
    private readonly IFeatureFlagRepository _repo;

    public UpdateFeatureFlagCommandHandler(IFeatureFlagRepository repo) => _repo = repo;

    public async Task<FeatureFlagDto?> Handle(UpdateFeatureFlagCommand request, CancellationToken ct)
    {
        var flag = await _repo.GetByKeyAsync(request.Key, ct);
        if (flag is null) return null;

        if (request.IsManuallyEnabled.HasValue) flag.IsManuallyEnabled = request.IsManuallyEnabled.Value;
        if (request.IsManuallyDisabled.HasValue) flag.IsManuallyDisabled = request.IsManuallyDisabled.Value;
        if (request.AvailableFrom.HasValue) flag.AvailableFrom = request.AvailableFrom.Value;
        if (request.AvailableUntil.HasValue) flag.AvailableUntil = request.AvailableUntil.Value;
        flag.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(flag, ct);

        var now = DateTime.UtcNow;
        return new FeatureFlagDto(flag.Id, flag.Key, flag.DisplayName,
            flag.IsCurrentlyEnabled(now),
            flag.IsManuallyEnabled, flag.IsManuallyDisabled,
            flag.AvailableFrom, flag.AvailableUntil);
    }
}
