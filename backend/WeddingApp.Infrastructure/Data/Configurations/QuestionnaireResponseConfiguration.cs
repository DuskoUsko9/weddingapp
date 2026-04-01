using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingApp.Domain.Entities;

namespace WeddingApp.Infrastructure.Data.Configurations;

public class QuestionnaireResponseConfiguration : IEntityTypeConfiguration<QuestionnaireResponse>
{
    public void Configure(EntityTypeBuilder<QuestionnaireResponse> builder)
    {
        builder.ToTable("questionnaire_responses");
        builder.HasKey(q => q.Id);
        builder.Property(q => q.Id).HasColumnName("id");
        builder.Property(q => q.GuestId).HasColumnName("guest_id");
        builder.Property(q => q.AlcoholPreference).HasColumnName("alcohol_preference").HasConversion<string>().HasMaxLength(30);
        builder.Property(q => q.HasAllergy).HasColumnName("has_allergy");
        builder.Property(q => q.AllergyNotes).HasColumnName("allergy_notes");
        builder.Property(q => q.SubmittedAt).HasColumnName("submitted_at");
        builder.Property(q => q.CreatedAt).HasColumnName("created_at");
        builder.Property(q => q.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(q => q.GuestId).IsUnique().HasDatabaseName("idx_questionnaire_guest_id");
    }
}
