using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using WeddingApp.Application.Common.Interfaces;

namespace WeddingApp.Api.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequireFeatureAttribute : Attribute, IAsyncActionFilter
{
    private readonly string _featureKey;

    public RequireFeatureAttribute(string featureKey) => _featureKey = featureKey;

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var featureFlagService = context.HttpContext.RequestServices
            .GetRequiredService<IFeatureFlagService>();

        if (!await featureFlagService.IsEnabledAsync(_featureKey))
        {
            context.Result = new ObjectResult(new { data = (object?)null, error = "Táto funkcia ešte nie je dostupná." })
            {
                StatusCode = 403
            };
            return;
        }

        await next();
    }
}
