namespace ECommerce.Core.Models;

public class Order
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public decimal Total { get; set; }

    public string Status { get; set; } = "Pending";

    public List<OrderItem> OrderItems { get; set; } = new();
}