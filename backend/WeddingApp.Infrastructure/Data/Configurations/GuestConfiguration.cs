using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;
using WeddingApp.Domain.Enums;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class GuestConfiguration : IEntityTypeConfiguration<Guest>
{
    public void Configure(EntityTypeBuilder<Guest> builder)
    {
        builder.ToTable("guests");
        builder.HasKey(g => g.Id);
        builder.Property(g => g.Id).HasColumnName("id");
        builder.Property(g => g.FullName).HasColumnName("full_name").HasMaxLength(200).IsRequired();
        builder.Property(g => g.NormalizedName).HasColumnName("normalized_name").HasMaxLength(200).IsRequired();
        builder.Property(g => g.Side).HasColumnName("side").HasConversion<string>().HasMaxLength(20);
        builder.Property(g => g.IsChild).HasColumnName("is_child");
        builder.Property(g => g.AgeAtWedding).HasColumnName("age_at_wedding");
        builder.Property(g => g.AlcoholDefault).HasColumnName("alcohol_default").HasConversion<string>().HasMaxLength(30);
        builder.Property(g => g.GuestType).HasColumnName("guest_type").HasMaxLength(30);
        builder.Property(g => g.Category).HasColumnName("category").HasConversion<string>().HasMaxLength(30);
        builder.Property(g => g.IsConfirmed).HasColumnName("is_confirmed");
        builder.Property(g => g.Email).HasColumnName("email").HasMaxLength(300);
        builder.Property(g => g.InvitationToken).HasColumnName("invitation_token");
        builder.Property(g => g.InvitationSentAt).HasColumnName("invitation_sent_at");
        builder.Property(g => g.CreatedAt).HasColumnName("created_at");
        builder.Property(g => g.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(g => g.InvitationToken).IsUnique().HasDatabaseName("idx_guests_invitation_token");

        builder.HasOne(g => g.QuestionnaireResponse)
               .WithOne(q => q.Guest)
               .HasForeignKey<QuestionnaireResponse>(q => q.GuestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(g => g.SongRequests)
               .WithOne(s => s.Guest)
               .HasForeignKey(s => s.GuestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(g => g.ThankYouMessage)
               .WithOne(t => t.Guest)
               .HasForeignKey<ThankYouMessage>(t => t.GuestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(g => g.NormalizedName).HasDatabaseName("idx_guests_normalized_name");
        builder.HasIndex(g => g.IsConfirmed).HasDatabaseName("idx_guests_is_confirmed");
    }
}
