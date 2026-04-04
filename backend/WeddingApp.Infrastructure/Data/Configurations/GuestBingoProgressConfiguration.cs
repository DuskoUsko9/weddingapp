using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class GuestBingoProgressConfiguration : IEntityTypeConfiguration<GuestBingoProgress>
{
    public void Configure(EntityTypeBuilder<GuestBingoProgress> builder)
    {
        builder.ToTable("guest_bingo_progress");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");
        builder.Property(p => p.GuestId).HasColumnName("guest_id");
        builder.Property(p => p.ChallengeId).HasColumnName("challenge_id");
        builder.Property(p => p.PhotoUrl).HasColumnName("photo_url");
        builder.Property(p => p.CompletedAt).HasColumnName("completed_at");
        builder.Property(p => p.CreatedAt).HasColumnName("created_at");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(p => p.Guest)
            .WithMany(g => g.BingoProgress)
            .HasForeignKey(p => p.GuestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Challenge)
            .WithMany()
            .HasForeignKey(p => p.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => new { p.GuestId, p.ChallengeId })
            .IsUnique()
            .HasDatabaseName("idx_bingo_progress_guest_challenge");
    }
}
