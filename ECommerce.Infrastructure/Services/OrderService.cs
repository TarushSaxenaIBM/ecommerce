using ECommerce.Core.DTOs;
using ECommerce.Core.Models;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using ECommerce.Core.Interfaces;


namespace ECommerce.Infrastructure.Services;

public class OrderService
{
    private readonly AppDbContext _context;
    private readonly IOrderNotificationService? _notificationService;

    public OrderService(
        AppDbContext context,
        IOrderNotificationService? notificationService = null)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<Order?> CheckoutAsync(
    string userId,
    CheckoutDto dto)
    {
        if (dto.Items.Count == 0)
            return null;

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var order = new Order
            {
                UserId = userId,
                Status = "Pending"
            };

            decimal total = 0;

            foreach (var item in dto.Items)
            {
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                if (product == null)
                {
                    await transaction.RollbackAsync();
                    return null;
                }

                if (item.Quantity <= 0 ||
                    product.Stock < item.Quantity)
                {
                    await transaction.RollbackAsync();
                    return null;
                }

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    Price = product.Price
                };

                order.OrderItems.Add(orderItem);

                total += product.Price * item.Quantity;

                product.Stock -= item.Quantity;
            }

            order.Total = total;

            _context.Orders.Add(order);

            await _context.SaveChangesAsync();



            await transaction.CommitAsync();

            if (_notificationService != null)
            {
                await _notificationService.NotifyOrderStatusChangedAsync(order.Id, "Pending");
            }

            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    public async Task<List<Order>> GetMyOrdersAsync(string userId)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.UserId == userId)
            .ToListAsync();
    }

    public async Task<Order?> GetMyOrderByIdAsync(int orderId, string userId)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                o.UserId == userId);
    }
}