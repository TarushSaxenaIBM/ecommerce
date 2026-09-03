using ECommerce.API.Hubs;
using ECommerce.API.Services;
using Microsoft.AspNetCore.SignalR;
using Moq;
using System.Timers;

namespace ECommerce.Tests;

public class NotificationServiceTests
{
    [Fact]
    public async Task NotifyOrderStatusChanged_SendsNotification()
    {
        var clients = new Mock<IHubClients>();
        var clientProxy = new Mock<IClientProxy>();
        var hubContext = new Mock<IHubContext<OrderHub>>();

        clients
            .Setup(c => c.All)
            .Returns(clientProxy.Object);

        hubContext
            .Setup(h => h.Clients)
            .Returns(clients.Object);

        var service = new SignalROrderNotificationService(
            hubContext.Object);

        await service.NotifyOrderStatusChangedAsync(1, "Paid");

        clientProxy.Verify(
            c => c.SendCoreAsync(
                "OrderStatusChanged",
                It.Is<object[]>(args =>
                    (int)args[0] == 1 &&
                    (string)args[1] == "Paid"),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }
}