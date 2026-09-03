using ECommerce.API.Hubs;
using ECommerce.Core.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace ECommerce.API.Services;

public class SignalROrderNotificationService : IOrderNotificationService
{
    private readonly IHubContext<OrderHub> _hubContext;

    public SignalROrderNotificationService(IHubContext<OrderHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyOrderStatusChangedAsync(
        int orderId,
        string status)
    {
        await _hubContext.Clients.All.SendAsync(
            "OrderStatusChanged",
            orderId,
            status);
    }

    public Task NotifyOrderStatusChangedAsync(object id, string v)
    {
        throw new NotImplementedException();
    }
}