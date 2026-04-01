using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class StaticContentConfiguration : IEntityTypeConfiguration<StaticContent>
{
    public void Configure(EntityTypeBuilder<StaticContent> builder)
    {
        builder.ToTable("static_content");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.Key).HasColumnName("key").HasMaxLength(100).IsRequired();
        builder.Property(s => s.Title).HasColumnName("title").HasMaxLength(300).IsRequired();
        builder.Property(s => s.Content).HasColumnName("content").IsRequired();
        builder.Property(s => s.Metadata).HasColumnName("metadata");
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");
        builder.Property(s => s.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(s => s.Key).IsUnique().HasDatabaseName("idx_static_content_key");
    }
}
