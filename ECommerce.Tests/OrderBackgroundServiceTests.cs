using ECommerce.Core.Interfaces;
using ECommerce.Core.Models;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;

namespace ECommerce.Tests;

public class OrderBackgroundServiceTests
{
    [Fact]
    public async Task ExpiredPendingOrder_IsDeleted_AndStockRestored()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        using (var context = new AppDbContext(options))
        {
            await context.Database.EnsureCreatedAsync();

            var product = new Product
            {
                Name = "Test Product",
                Price = 100,
                Stock = 5
            };

            context.Products.Add(product);
            await context.SaveChangesAsync();

            var order = new Order
            {
                UserId = "user1",
                Status = "Pending",
                CreatedAt = DateTime.UtcNow.AddMinutes(-31)
            };

            order.OrderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = 2,
                Price = 100
            });

            context.Orders.Add(order);
            await context.SaveChangesAsync();
        }

        var notification = new Mock<IOrderNotificationService>();

        var services = new ServiceCollection();

        services.AddScoped(_ =>
            new AppDbContext(options));

        services.AddScoped(_ => notification.Object);

        var provider = services.BuildServiceProvider();

        var scopeFactory =
            provider.GetRequiredService<IServiceScopeFactory>();

        var logger =
            Mock.Of<ILogger<OrderBackgroundService>>();

        var service = new OrderBackgroundService(
            scopeFactory,
            logger);

        using var cts = new CancellationTokenSource();

        cts.CancelAfter(TimeSpan.FromMilliseconds(100));

        await service.StartAsync(cts.Token);

        await Task.Delay(50);

        await service.StopAsync(CancellationToken.None);

        using var verifyContext = new AppDbContext(options);

        var deletedOrder = await verifyContext.Orders
            .FirstOrDefaultAsync();

        var updatedProduct = await verifyContext.Products
            .FirstAsync();

        Assert.Null(deletedOrder);
        Assert.Equal(7, updatedProduct.Stock);

        notification.Verify(
            n => n.NotifyOrderStatusChangedAsync(
                It.IsAny<int>(),
                "Cancelled"),
            Times.Once);

        await connection.CloseAsync();
    }
}