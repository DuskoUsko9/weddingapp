using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class MenuSectionConfiguration : IEntityTypeConfiguration<MenuSection>
{
    public void Configure(EntityTypeBuilder<MenuSection> builder)
    {
        builder.ToTable("menu_sections");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
        builder.Property(s => s.DisplayOrder).HasColumnName("display_order");
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");
        builder.Property(s => s.UpdatedAt).HasColumnName("updated_at");
        builder.HasMany(s => s.Items).WithOne(i => i.Section)
               .HasForeignKey(i => i.SectionId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class MenuItemConfiguration : IEntityTypeConfiguration<MenuItem>
{
    public void Configure(EntityTypeBuilder<MenuItem> builder)
    {
        builder.ToTable("menu_items");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Id).HasColumnName("id");
        builder.Property(i => i.SectionId).HasColumnName("section_id");
        builder.Property(i => i.Name).HasColumnName("name").HasMaxLength(300).IsRequired();
        builder.Property(i => i.Description).HasColumnName("description");
        builder.Property(i => i.DisplayOrder).HasColumnName("display_order");
        builder.Property(i => i.CreatedAt).HasColumnName("created_at");
        builder.Property(i => i.UpdatedAt).HasColumnName("updated_at");
    }
}
