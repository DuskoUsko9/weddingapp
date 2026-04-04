using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using WeddingApp.Application.Common.Interfaces;
using WeddingApp.Domain.Interfaces.Repositories;
using WeddingApp.Infrastructure.Auth;
using WeddingApp.Infrastructure.Data;
using WeddingApp.Infrastructure.Data.Repositories;
using WeddingApp.Infrastructure.Data.Seed;
using WeddingApp.Infrastructure.Services;
using WeddingApp.Infrastructure.SignalR;

namespace WeddingApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        services.AddDbContext<WeddingAppDbContext>(opts =>
            opts.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Repositories
        services.AddScoped<IGuestRepository, GuestRepository>();
        services.AddScoped<IFeatureFlagRepository, FeatureFlagRepository>();
        services.AddScoped<IQuestionnaireRepository, QuestionnaireRepository>();
        services.AddScoped<ISongRequestRepository, SongRequestRepository>();
        services.AddScoped<IScheduleRepository, ScheduleRepository>();
        services.AddScoped<IMenuRepository, MenuRepository>();
        services.AddScoped<IStaticContentRepository, StaticContentRepository>();
        services.AddScoped<ILoveStoryRepository, LoveStoryRepository>();
        services.AddScoped<IBingoChallengeRepository, BingoChallengeRepository>();
        services.AddScoped<IPhotoRepository, PhotoRepository>();
        services.AddScoped<IGuestBingoProgressRepository, GuestBingoProgressRepository>();
        services.AddScoped<ISeatingRepository, SeatingRepository>();
        services.AddScoped<IThankYouMessageRepository, ThankYouMessageRepository>();

        // Services
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IFeatureFlagService, FeatureFlagService>();
        services.AddScoped<ISongRequestNotifier, SongRequestNotifier>();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<ITimeProvider, SimulationAwareTimeProvider>();
        if (configuration["Azure:BlobStorage:ConnectionString"] is not null)
            services.AddScoped<IFileStorageService, AzureBlobStorageService>();
        else
            services.AddScoped<IFileStorageService, LocalFileStorageService>();
        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<IInvitationLinkBuilder, InvitationLinkBuilder>();

        // Seed
        services.AddScoped<DataSeeder>();

        // SignalR
        services.AddSignalR();

        // JWT Authentication
        var jwtSecret = configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret is not configured.");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opts =>
            {
                opts.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidateAudience         = true,
                    ValidateLifetime         = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer              = configuration["Jwt:Issuer"] ?? "WeddingApp",
                    ValidAudience            = configuration["Jwt:Audience"] ?? "WeddingAppUsers",
                    IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                };

                // Allow JWT via query string for SignalR WebSocket connections
                opts.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        var accessToken = ctx.Request.Query["access_token"];
                        var path = ctx.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/hubs"))
                        {
                            ctx.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();

        return services;
    }
}
