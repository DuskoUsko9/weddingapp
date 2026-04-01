using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class ScheduleItemConfiguration : IEntityTypeConfiguration<ScheduleItem>
{
    public void Configure(EntityTypeBuilder<ScheduleItem> builder)
    {
        builder.ToTable("schedule_items");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.TimeLabel).HasColumnName("time_label").HasMaxLength(10).IsRequired();
        builder.Property(s => s.TimeMinutes).HasColumnName("time_minutes");
        builder.Property(s => s.Title).HasColumnName("title").HasMaxLength(300).IsRequired();
        builder.Property(s => s.Description).HasColumnName("description");
        builder.Property(s => s.Icon).HasColumnName("icon").HasMaxLength(10);
        builder.Property(s => s.DisplayOrder).HasColumnName("display_order");
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");
        builder.Property(s => s.UpdatedAt).HasColumnName("updated_at");
    }
}
