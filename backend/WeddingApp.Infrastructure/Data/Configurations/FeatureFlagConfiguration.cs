using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class FeatureFlagConfiguration : IEntityTypeConfiguration<FeatureFlag>
{
    public void Configure(EntityTypeBuilder<FeatureFlag> builder)
    {
        builder.ToTable("feature_flags");
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id).HasColumnName("id");
        builder.Property(f => f.Key).HasColumnName("key").HasMaxLength(100).IsRequired();
        builder.Property(f => f.DisplayName).HasColumnName("display_name").HasMaxLength(200).IsRequired();
        builder.Property(f => f.IsManuallyEnabled).HasColumnName("is_manually_enabled");
        builder.Property(f => f.IsManuallyDisabled).HasColumnName("is_manually_disabled");
        builder.Property(f => f.AvailableFrom).HasColumnName("available_from");
        builder.Property(f => f.AvailableUntil).HasColumnName("available_until");
        builder.Property(f => f.RolesAllowed)
            .HasColumnName("roles_allowed")
            .HasMaxLength(1000)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<string[]>(v, (JsonSerializerOptions?)null) ?? Array.Empty<string>())
            .Metadata.SetValueComparer(new ValueComparer<string[]>(
                (a, b) => a != null && b != null && a.SequenceEqual(b),
                v => v.Aggregate(0, (h, s) => HashCode.Combine(h, s.GetHashCode())),
                v => v.ToArray()));
        builder.Property(f => f.CreatedAt).HasColumnName("created_at");
        builder.Property(f => f.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(f => f.Key).IsUnique().HasDatabaseName("idx_feature_flags_key");
    }
}
