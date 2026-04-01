using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class LoveStoryEventConfiguration : IEntityTypeConfiguration<LoveStoryEvent>
{
    public void Configure(EntityTypeBuilder<LoveStoryEvent> builder)
    {
        builder.ToTable("love_story_events");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.EventDate).HasColumnName("event_date").HasColumnType("date");
        builder.Property(e => e.Title).HasColumnName("title").HasMaxLength(300).IsRequired();
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.PhotoUrl).HasColumnName("photo_url");
        builder.Property(e => e.DisplayOrder).HasColumnName("display_order");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(e => e.EventDate).HasDatabaseName("idx_love_story_date");
    }
}
