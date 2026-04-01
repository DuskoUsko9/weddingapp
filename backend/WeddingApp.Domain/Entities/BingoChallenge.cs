using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class BingoChallenge : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
