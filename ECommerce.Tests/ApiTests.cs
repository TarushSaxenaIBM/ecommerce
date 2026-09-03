using Microsoft.AspNetCore.Mvc.Testing;

namespace ECommerce.Tests;

public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Swagger_ReturnsSuccess()
    {
        // Act
        var response = await _client.GetAsync("/swagger/index.html");

        // Assert
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task UnknownProduct_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/Products/99999");

        // Assert
        Assert.Equal(
            System.Net.HttpStatusCode.NotFound,
            response.StatusCode);
    }
}