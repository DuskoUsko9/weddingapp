using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class BingoChallengeConfiguration : IEntityTypeConfiguration<BingoChallenge>
{
    public void Configure(EntityTypeBuilder<BingoChallenge> builder)
    {
        builder.ToTable("bingo_challenges");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id).HasColumnName("id");
        builder.Property(b => b.Title).HasColumnName("title").HasMaxLength(300).IsRequired();
        builder.Property(b => b.Description).HasColumnName("description");
        builder.Property(b => b.DisplayOrder).HasColumnName("display_order");
        builder.Property(b => b.IsActive).HasColumnName("is_active");
        builder.Property(b => b.CreatedAt).HasColumnName("created_at");
        builder.Property(b => b.UpdatedAt).HasColumnName("updated_at");
    }
}
