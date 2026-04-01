using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingApp.Application.Questionnaire.Commands;
using WeddingApp.Application.Questionnaire.Queries;
using WeddingApp.Api.Filters;

namespace WeddingApp.Api.Controllers;

[Authorize]
public class QuestionnaireController : BaseController
{
    private readonly IMediator _mediator;

    public QuestionnaireController(IMediator mediator) => _mediator = mediator;

    [HttpGet("my")]
    [RequireFeature("questionnaire")]
    public async Task<IActionResult> GetMy(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetMyQuestionnaireQuery(), ct));

    [HttpPost]
    [Authorize(Roles = "Guest")]
    [RequireFeature("questionnaire")]
    public async Task<IActionResult> Submit([FromBody] QuestionnaireRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new SubmitQuestionnaireCommand(request.AlcoholPreference, request.HasAllergy, request.AllergyNotes), ct);
        return OkData(result);
    }

    [HttpPut]
    [Authorize(Roles = "Guest")]
    [RequireFeature("questionnaire")]
    public async Task<IActionResult> Update([FromBody] QuestionnaireRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateQuestionnaireCommand(request.AlcoholPreference, request.HasAllergy, request.AllergyNotes), ct);
        return OkOrNotFound(result);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin,MasterOfCeremony")]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        OkData(await _mediator.Send(new GetAllQuestionnaireResponsesQuery(), ct));
}

public record QuestionnaireRequest(string AlcoholPreference, bool HasAllergy, string? AllergyNotes);
