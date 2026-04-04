using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class SeatingAssignmentConfiguration : IEntityTypeConfiguration<SeatingAssignment>
{
    public void Configure(EntityTypeBuilder<SeatingAssignment> builder)
    {
        builder.ToTable("seating_assignments");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.GuestId).HasColumnName("guest_id");
        builder.Property(s => s.TableNumber).HasColumnName("table_number");
        builder.Property(s => s.TableName).HasColumnName("table_name").HasMaxLength(100);
        builder.Property(s => s.SeatNote).HasColumnName("seat_note").HasMaxLength(200);
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");
        builder.Property(s => s.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(s => s.Guest)
            .WithOne(g => g.SeatingAssignment)
            .HasForeignKey<SeatingAssignment>(s => s.GuestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(s => s.GuestId).IsUnique().HasDatabaseName("idx_seating_guest_id");
        builder.HasIndex(s => s.TableNumber).HasDatabaseName("idx_seating_table_number");
    }
}
