using Microsoft.AspNetCore.Mvc;

namespace WeddingApp.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected IActionResult OkOrNotFound<T>(T? value) =>
        value is not null ? Ok(new { data = value, error = (string?)null })
                          : NotFound(new { data = (object?)null, error = "Nenašlo sa." });

    protected IActionResult OkData<T>(T value) =>
        Ok(new { data = value, error = (string?)null });

    protected IActionResult ErrorResult(string message, int statusCode = 400) =>
        StatusCode(statusCode, new { data = (object?)null, error = message });
}
