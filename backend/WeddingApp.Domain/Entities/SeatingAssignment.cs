using WeddingApp.Domain.Common;

namespace WeddingApp.Domain.Entities;

public class SeatingAssignment : BaseEntity
{
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; } = null!;
    public int TableNumber { get; set; }
    public string? TableName { get; set; }
    public string? SeatNote { get; set; }
}
