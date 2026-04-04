using Microsoft.Extensions.Configuration;
using WeddingApp.Application.Common.Interfaces;

namespace WeddingApp.Infrastructure.Services;

public class InvitationLinkBuilder : IInvitationLinkBuilder
{
    private readonly string _appBaseUrl;

    public InvitationLinkBuilder(IConfiguration config)
    {
        _appBaseUrl = config["App:BaseUrl"]?.TrimEnd('/')
            ?? throw new InvalidOperationException("App:BaseUrl is not configured.");
    }

    public string Build(Guid invitationToken) =>
        $"{_appBaseUrl}/magic-login?t={invitationToken}";
}
