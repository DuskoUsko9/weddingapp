namespace WeddingApp.Application.Common.Interfaces;

public interface IInvitationLinkBuilder
{
    string Build(Guid invitationToken);
}
