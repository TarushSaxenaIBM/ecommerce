namespace ECommerce.Core.Interfaces;

public interface IOrderNotificationService
{
    Task NotifyOrderStatusChangedAsync(int orderId, string status);
    Task NotifyOrderStatusChangedAsync(object id, string v);
}