using ECommerce.Core.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
namespace ECommerce.Infrastructure.Services;

public class PaymentService
{
    private readonly AppDbContext _context;
    private readonly IOrderNotificationService _notificationService;

    public PaymentService(
        AppDbContext context,
        IOrderNotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<bool> ProcessPaymentAsync(
        int orderId,
        string userId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                o.UserId == userId);

        if (order == null)
            return false;

        if (order.Status != "Pending")
            return false;

        order.Status = "Paid";

        await _context.SaveChangesAsync();

        await _notificationService.NotifyOrderStatusChangedAsync(
    order.Id,
    "Paid");

        return true;
    }
}