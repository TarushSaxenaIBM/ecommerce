using ECommerce.Core.DTOs;
using ECommerce.Core.Models;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Tests;

public class OrderServiceTests
{
    private AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }   

    [Fact]
    public async Task CheckoutAsync_WithValidProduct_CreatesOrder()
    {
        // Arrange
        using var context = CreateContext();

        context.Products.Add(new Product
        {
            Id = 1,
            Name = "Laptop",
            Price = 1000,
            Stock = 10
        });

        await context.SaveChangesAsync();

        var service = new OrderService(context, null!);

        var dto = new CheckoutDto
        {
            Items = new List<CheckoutItemDto>
            {
                new()
                {
                    ProductId = 1,
                    Quantity = 2
                }
            }
        };

        // Act
        var order = await service.CheckoutAsync("user-1", dto);

        // Assert
        Assert.NotNull(order);
        Assert.Equal("user-1", order.UserId);
        Assert.Equal(2000, order.Total);
        Assert.Equal("Pending", order.Status);
        Assert.Single(order.OrderItems);
    }

    [Fact]
    public async Task CheckoutAsync_ReducesStock()
    {
        // Arrange
        using var context = CreateContext();

        context.Products.Add(new Product
        {
            Id = 1,
            Name = "Laptop",
            Price = 1000,
            Stock = 10
        });

        await context.SaveChangesAsync();

        var service = new OrderService(context, null!);

        var dto = new CheckoutDto
        {
            Items = new List<CheckoutItemDto>
            {
                new()
                {
                    ProductId = 1,
                    Quantity = 3
                }
            }
        };

        // Act
        await service.CheckoutAsync("user-1", dto);

        // Assert
        var product = await context.Products.FindAsync(1);

        Assert.Equal(7, product!.Stock);
    }

    [Fact]
    public async Task CheckoutAsync_WhenStockIsInsufficient_ReturnsNull()
    {
        // Arrange
        using var context = CreateContext();

        context.Products.Add(new Product
        {
            Id = 1,
            Name = "Laptop",
            Price = 1000,
            Stock = 2
        });

        await context.SaveChangesAsync();

        var service = new OrderService(context, null!);

        var dto = new CheckoutDto
        {
            Items = new List<CheckoutItemDto>
            {
                new()
                {
                    ProductId = 1,
                    Quantity = 5
                }
            }
        };

        // Act
        var order = await service.CheckoutAsync("user-1", dto);

        // Assert
        Assert.Null(order);
    }

    [Fact]
    public async Task CheckoutAsync_WithEmptyCart_ReturnsNull()
    {
        // Arrange
        using var context = CreateContext();

        var service = new OrderService(context, null!);

        var dto = new CheckoutDto();

        // Act
        var order = await service.CheckoutAsync("user-1", dto);

        // Assert
        Assert.Null(order);
    }

    [Fact]
    public async Task GetMyOrdersAsync_ReturnsOnlyUsersOrders()
    {
        // Arrange
        using var context = CreateContext();

        context.Orders.AddRange(
            new Order
            {
                UserId = "user-1",
                Total = 100
            },
            new Order
            {
                UserId = "user-2",
                Total = 200
            });

        await context.SaveChangesAsync();

        var service = new OrderService(context, null);

        // Act
        var orders = await service.GetMyOrdersAsync("user-1");

        // Assert
        Assert.Single(orders);
        Assert.Equal("user-1", orders[0].UserId);
    }

    [Fact]
    public async Task GetMyOrderByIdAsync_CannotReturnAnotherUsersOrder()
    {
        // Arrange
        using var context = CreateContext();

        var order = new Order
        {
            UserId = "user-2",
            Total = 500
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        var service = new OrderService(context, null!);

        // Act
        var result = await service.GetMyOrderByIdAsync(
            order.Id,
            "user-1");

        // Assert
        Assert.Null(result);
    }
}