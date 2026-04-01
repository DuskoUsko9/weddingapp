using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class SongRequestConfiguration : IEntityTypeConfiguration<SongRequest>
{
    public void Configure(EntityTypeBuilder<SongRequest> builder)
    {
        builder.ToTable("song_requests");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.GuestId).HasColumnName("guest_id");
        builder.Property(s => s.SongName).HasColumnName("song_name").HasMaxLength(300).IsRequired();
        builder.Property(s => s.Artist).HasColumnName("artist").HasMaxLength(300);
        builder.Property(s => s.Dedication).HasColumnName("dedication").HasMaxLength(120);
        builder.Property(s => s.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20);
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");
        builder.Property(s => s.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(s => s.Status).HasDatabaseName("idx_song_requests_status");
        builder.HasIndex(s => s.GuestId).HasDatabaseName("idx_song_requests_guest_id");
        builder.HasIndex(s => s.CreatedAt).HasDatabaseName("idx_song_requests_created_at");
    }
}
