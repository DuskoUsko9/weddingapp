namespace WeddingApp.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendInvitationAsync(string toEmail, string guestName, string magicLink, CancellationToken ct = default);
}
