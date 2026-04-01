using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class ThankYouMessageConfiguration : IEntityTypeConfiguration<ThankYouMessage>
{
    public void Configure(EntityTypeBuilder<ThankYouMessage> builder)
    {
        builder.ToTable("thank_you_messages");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("id");
        builder.Property(t => t.GuestId).HasColumnName("guest_id");
        builder.Property(t => t.Message).HasColumnName("message").IsRequired();
        builder.Property(t => t.PhotoUrl).HasColumnName("photo_url");
        builder.Property(t => t.CreatedAt).HasColumnName("created_at");
        builder.Property(t => t.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(t => t.GuestId).IsUnique().HasDatabaseName("idx_thank_you_guest_id");
    }
}
