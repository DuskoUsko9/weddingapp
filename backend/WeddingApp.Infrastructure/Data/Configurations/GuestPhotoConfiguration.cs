using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class GuestPhotoConfiguration : IEntityTypeConfiguration<GuestPhoto>
{
    public void Configure(EntityTypeBuilder<GuestPhoto> builder)
    {
        builder.ToTable("guest_photos");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");
        builder.Property(p => p.GuestId).HasColumnName("guest_id");
        builder.Property(p => p.FileName).HasColumnName("file_name").HasMaxLength(500).IsRequired();
        builder.Property(p => p.Url).HasColumnName("url").IsRequired();
        builder.Property(p => p.FileSizeBytes).HasColumnName("file_size_bytes");
        builder.Property(p => p.CreatedAt).HasColumnName("created_at");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(p => p.Guest)
            .WithMany(g => g.Photos)
            .HasForeignKey(p => p.GuestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => p.GuestId).HasDatabaseName("idx_guest_photos_guest_id");
        builder.HasIndex(p => p.CreatedAt).HasDatabaseName("idx_guest_photos_created_at");
    }
}
