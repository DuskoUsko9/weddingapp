using Microsoft.EntityFrameworkCore;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data;

public class WeddingAppDbContext : DbContext
{
    public WeddingAppDbContext(DbContextOptions<WeddingAppDbContext> options) : base(options) { }

    public DbSet<Guest> Guests => Set<Guest>();
    public DbSet<FeatureFlag> FeatureFlags => Set<FeatureFlag>();
    public DbSet<QuestionnaireResponse> QuestionnaireResponses => Set<QuestionnaireResponse>();
    public DbSet<SongRequest> SongRequests => Set<SongRequest>();
    public DbSet<ScheduleItem> ScheduleItems => Set<ScheduleItem>();
    public DbSet<MenuSection> MenuSections => Set<MenuSection>();
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<StaticContent> StaticContents => Set<StaticContent>();
    public DbSet<LoveStoryEvent> LoveStoryEvents => Set<LoveStoryEvent>();
    public DbSet<BingoChallenge> BingoChallenges => Set<BingoChallenge>();
    public DbSet<ThankYouMessage> ThankYouMessages => Set<ThankYouMessage>();
    public DbSet<GuestPhoto> GuestPhotos => Set<GuestPhoto>();
    public DbSet<GuestBingoProgress> GuestBingoProgress => Set<GuestBingoProgress>();
    public DbSet<SeatingAssignment> SeatingAssignments => Set<SeatingAssignment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WeddingAppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
