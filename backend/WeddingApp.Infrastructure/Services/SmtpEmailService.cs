using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using QRCoder;
using WeddingApp.Application.Common.Interfaces;

namespace WeddingApp.Infrastructure.Services;

public class SmtpEmailService : IEmailService
{
    private readonly string _host;
    private readonly int _port;
    private readonly string _username;
    private readonly string _password;
    private readonly string _fromAddress;
    private readonly string _fromName;

    public SmtpEmailService(IConfiguration config)
    {
        _host        = config["Smtp:Host"]        ?? throw new InvalidOperationException("Smtp:Host is not configured.");
        _port        = int.Parse(config["Smtp:Port"] ?? "587");
        _username    = config["Smtp:Username"]    ?? throw new InvalidOperationException("Smtp:Username is not configured.");
        _password    = config["Smtp:Password"]    ?? throw new InvalidOperationException("Smtp:Password is not configured.");
        _fromAddress = config["Smtp:FromAddress"] ?? _username;
        _fromName    = config["Smtp:FromName"]    ?? "Maťka & Dušan";
    }

    public async Task SendInvitationAsync(string toEmail, string guestName, string magicLink, CancellationToken ct = default)
    {
        var qrBase64 = GenerateQrCodeBase64(magicLink);
        var html = BuildInvitationHtml(guestName, magicLink, qrBase64);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_fromName, _fromAddress));
        message.To.Add(new MailboxAddress(guestName, toEmail));
        message.Subject = "Pozývame ťa na našu svadbu! 💍";

        var bodyBuilder = new BodyBuilder { HtmlBody = html };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        var secureOption = _port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
        await client.ConnectAsync(_host, _port, secureOption, ct);
        await client.AuthenticateAsync(_username, _password, ct);
        await client.SendAsync(message, ct);
        await client.DisconnectAsync(true, ct);
    }

    private static string GenerateQrCodeBase64(string url)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.M);
        using var qrCode = new PngByteQRCode(qrData);
        var bytes = qrCode.GetGraphic(8, new byte[] { 114, 91, 40 }, new byte[] { 250, 249, 246 });
        return Convert.ToBase64String(bytes);
    }

    private static string BuildInvitationHtml(string guestName, string magicLink, string qrBase64)
    {
        // Use first name only for the greeting
        var firstName = guestName.Split(' ')[0];

        return $"""
        <!DOCTYPE html>
        <html lang="sk">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Pozývame ťa na našu svadbu!</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f0ece4;font-family:'Georgia',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ece4;padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#faf9f6;border-radius:24px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">

                  <!-- Header -->
                  <tr>
                    <td align="center" style="background-color:#725b28;padding:48px 40px 36px;">
                      <p style="margin:0 0 8px;color:#e8d9b5;font-size:13px;letter-spacing:4px;text-transform:uppercase;font-family:'Georgia',serif;">5. septembra 2026</p>
                      <h1 style="margin:0;color:#faf9f6;font-size:42px;font-family:'Georgia',serif;font-weight:normal;letter-spacing:2px;">Maťka &amp; Dušan</h1>
                      <p style="margin:12px 0 0;color:#e8d9b5;font-size:15px;font-family:'Georgia',serif;font-style:italic;">sa berú!</p>
                    </td>
                  </tr>

                  <!-- Divider ornament -->
                  <tr>
                    <td align="center" style="background-color:#c0a469;padding:10px 0;">
                      <p style="margin:0;color:#faf9f6;font-size:18px;letter-spacing:12px;">✦ ✦ ✦</p>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding:44px 48px 24px;">
                      <p style="margin:0 0 20px;font-size:22px;color:#725b28;font-family:'Georgia',serif;font-style:italic;">Milý/á {firstName},</p>
                      <p style="margin:0 0 16px;font-size:16px;color:#1a1c1a;line-height:1.75;">
                        po rokoch spoločného dobrodružstva — výletov, ktoré sme prežili, svadieb priateľov, kde sme tajne plakali, a nespočetných debát o tom, kto nechá viac bordel v kuchyni —
                        sme sa <strong>konečne rozhodli to spraviť poriadne</strong>. 💍
                      </p>
                      <p style="margin:0 0 16px;font-size:16px;color:#1a1c1a;line-height:1.75;">
                        Srdečne ťa pozývame na našu svadbu! Tešíme sa na teba, na váš smiech, možno aj na pár sĺz radosti (no dobre, aj my plakneme) a hlavne na to, že tento deň prežijeme
                        <strong>spolu s ľuďmi, na ktorých nám záleží</strong>.
                      </p>
                    </td>
                  </tr>

                  <!-- Details card -->
                  <tr>
                    <td style="padding:0 48px 36px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3f1;border-radius:16px;padding:0;">
                        <tr>
                          <td style="padding:28px 32px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:0 0 16px;">
                                  <p style="margin:0 0 4px;font-size:11px;color:#725b28;letter-spacing:3px;text-transform:uppercase;font-family:'Georgia',serif;">Kedy</p>
                                  <p style="margin:0;font-size:17px;color:#1a1c1a;font-family:'Georgia',serif;">Sobota, 5. september 2026 o 15:30</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:0 0 16px;border-top:1px solid #e0ddd7;padding-top:16px;">
                                  <p style="margin:0 0 4px;font-size:11px;color:#725b28;letter-spacing:3px;text-transform:uppercase;font-family:'Georgia',serif;">Kde</p>
                                  <p style="margin:0;font-size:17px;color:#1a1c1a;font-family:'Georgia',serif;">Penzión Zemiansky Dvor, Surovce</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="border-top:1px solid #e0ddd7;padding-top:16px;">
                                  <p style="margin:0 0 4px;font-size:11px;color:#725b28;letter-spacing:3px;text-transform:uppercase;font-family:'Georgia',serif;">Dress code</p>
                                  <p style="margin:0;font-size:17px;color:#1a1c1a;font-family:'Georgia',serif;">Elegantný — čím elegantnejší, tým lepší</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- App section -->
                  <tr>
                    <td style="padding:0 48px 36px;">
                      <p style="margin:0 0 12px;font-size:16px;color:#1a1c1a;line-height:1.75;">
                        Špeciálne pre vás sme pripravili <strong>svadobnú aplikáciu MadU</strong> — nájdeš tam program dňa, info o parkovaní, miesta na sedenie, foto-bingo a ešte kopec zábavy navyše. 🎉
                      </p>
                      <p style="margin:0 0 20px;font-size:16px;color:#1a1c1a;line-height:1.75;">
                        Klikni na tlačidlo nižšie (alebo naskenuj QR kód) a <strong>budeš rovno prihlásený/á</strong> — žiadne heslá, žiadne komplikácie.
                      </p>
                    </td>
                  </tr>

                  <!-- CTA button -->
                  <tr>
                    <td align="center" style="padding:0 48px 40px;">
                      <a href="{magicLink}"
                         style="display:inline-block;background-color:#725b28;color:#faf9f6;font-size:17px;font-family:'Georgia',serif;text-decoration:none;padding:16px 48px;border-radius:24px;letter-spacing:1px;">
                        Otvoriť svadobnú aplikáciu →
                      </a>
                      <p style="margin:16px 0 0;font-size:12px;color:#8a7c6b;">
                        Ak tlačidlo nefunguje, skopíruj tento odkaz do prehliadača:<br/>
                        <a href="{magicLink}" style="color:#725b28;word-break:break-all;">{magicLink}</a>
                      </p>
                    </td>
                  </tr>

                  <!-- QR code -->
                  <tr>
                    <td align="center" style="padding:0 48px 44px;">
                      <table cellpadding="0" cellspacing="0" style="background-color:#f4f3f1;border-radius:16px;display:inline-block;">
                        <tr>
                          <td style="padding:24px 32px;" align="center">
                            <p style="margin:0 0 16px;font-size:13px;color:#725b28;letter-spacing:2px;text-transform:uppercase;font-family:'Georgia',serif;">QR kód pre mobilný telefón</p>
                            <img src="data:image/png;base64,{qrBase64}"
                                 alt="QR kód na prihlásenie"
                                 width="180" height="180"
                                 style="display:block;border-radius:8px;" />
                            <p style="margin:12px 0 0;font-size:12px;color:#8a7c6b;">Naskenuj a prihlás sa priamo</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#725b28;padding:32px 48px;" align="center">
                      <p style="margin:0 0 8px;color:#e8d9b5;font-size:22px;font-family:'Georgia',serif;font-style:italic;">Tešíme sa na teba! 🥂</p>
                      <p style="margin:0;color:#c0a469;font-size:14px;font-family:'Georgia',serif;">Maťka &amp; Dušan</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """;
    }
}
