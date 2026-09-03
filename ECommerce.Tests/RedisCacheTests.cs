using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Tests;

public class RedisCacheTests
{
    [Fact]
    public async Task Redis_CanStoreAndRetrieveValue()
    {
        var services = new ServiceCollection();

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = "localhost:6379";
            options.InstanceName = "ECommerceTests:";
        });

        var provider = services.BuildServiceProvider();

        var cache = provider.GetRequiredService<IDistributedCache>();

        await cache.SetStringAsync(
            "test-key",
            "hello");

        var value = await cache.GetStringAsync("test-key");

        Assert.Equal("hello", value);

        await cache.RemoveAsync("test-key");
    }
}