namespace ECommerce.Core.DTOs;

public class CheckoutDto
{
    public List<CheckoutItemDto> Items { get; set; } = new();
}

public class CheckoutItemDto
{
    public int ProductId { get; set; }

    public int Quantity { get; set; }
}