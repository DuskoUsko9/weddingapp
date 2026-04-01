using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.StaticContent.Commands;
using WeddingApp.Application.StaticContent.Queries;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class StaticContentController : BaseController
{
    private readonly IMediator _mediator;

    public StaticContentController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{key}")]
    public async Task<IActionResult> Get(string key, CancellationToken ct) =>
        OkOrNotFound(await _mediator.Send(new GetStaticContentQuery(key), ct));

    [HttpPut("{key}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string key, [FromBody] UpdateStaticContentRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateStaticContentCommand(key, request.Title, request.Content, request.Metadata), ct);
        return OkOrNotFound(result);
    }
}

public record UpdateStaticContentRequest(string Title, string Content, string? Metadata);
