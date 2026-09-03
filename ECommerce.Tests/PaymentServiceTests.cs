using ECommerce.Core.Interfaces;
using ECommerce.Core.Models;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace ECommerce.Tests;

public class PaymentServiceTests
{
    private AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task ProcessPaymentAsync_WithPendingOrder_SetsOrderToPaid()
    {
        // Arrange
        using var context = CreateContext();

        var order = new Order
        {
            UserId = "user-1",
            Total = 1000,
            Status = "Pending"
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        var notificationMock = new Mock<IOrderNotificationService>();
        var service = new PaymentService(context, notificationMock.Object);

        // Act
        var result = await service.ProcessPaymentAsync(
            order.Id,
            "user-1");

        // Assert
        Assert.True(result);

        var updatedOrder = await context.Orders.FindAsync(order.Id);

        Assert.Equal("Paid", updatedOrder!.Status);
    }

    [Fact]
    public async Task ProcessPaymentAsync_WithWrongUser_ReturnsFalse()
    {
        // Arrange
        using var context = CreateContext();

        var order = new Order
        {
            UserId = "user-1",
            Total = 1000,
            Status = "Pending"
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        var notificationMock = new Mock<IOrderNotificationService>();
        var service = new PaymentService(context, notificationMock.Object);

        // Act
        var result = await service.ProcessPaymentAsync(
            order.Id,
            "user-2");

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task ProcessPaymentAsync_WithAlreadyPaidOrder_ReturnsFalse()
    {
        // Arrange
        using var context = CreateContext();

        var order = new Order
        {
            UserId = "user-1",
            Total = 1000,
            Status = "Paid"
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        var notificationMock = new Mock<IOrderNotificationService>();
        var service = new PaymentService(context, notificationMock.Object);

        // Act
        var result = await service.ProcessPaymentAsync(
            order.Id,
            "user-1");

        // Assert
        Assert.False(result);
    }
}