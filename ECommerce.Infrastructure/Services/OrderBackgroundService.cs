using ECommerce.Core.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Services;

public class OrderBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<OrderBackgroundService> _logger;

    public OrderBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<OrderBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider
                .GetRequiredService<AppDbContext>();

            var notificationService = scope.ServiceProvider
                .GetRequiredService<IOrderNotificationService>();

            var cutoffTime = DateTime.UtcNow.AddMinutes(-1);

            var expiredOrders = await context.Orders
                .Include(o => o.OrderItems)
                .Where(o =>
                    o.Status == "Pending" &&
                    o.CreatedAt < cutoffTime)
                .ToListAsync(stoppingToken);

            if (expiredOrders.Count > 0)
            {
                foreach (var order in expiredOrders)
                {
                    foreach (var item in order.OrderItems)
                    {
                        var product = await context.Products.FindAsync(
                            [item.ProductId],
                            stoppingToken);

                        if (product != null)
                        {
                            product.Stock += item.Quantity;
                        }
                    }

                    context.Orders.Remove(order);

                    _logger.LogInformation(
                        "Deleted unpaid order {OrderId} and restored stock",
                        order.Id);

                    await notificationService.NotifyOrderStatusChangedAsync(
                        order.Id,
                        "Cancelled");
                }

                await context.SaveChangesAsync(stoppingToken);
            }

            await Task.Delay(
                TimeSpan.FromMinutes(1),
                stoppingToken);
        }
    }
}