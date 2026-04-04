namespace WeddingApp.Application.Common.Interfaces;

public interface ITimeProvider
{
    DateTime UtcNow { get; }
}
