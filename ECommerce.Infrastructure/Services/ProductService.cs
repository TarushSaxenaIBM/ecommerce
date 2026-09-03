using ECommerce.Core.Models;
using ECommerce.Infrastructure.Repositories;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
namespace ECommerce.Infrastructure.Services;


public class ProductService
{
    private readonly ProductRepository _repository;
    private readonly IDistributedCache _cache;

    public ProductService(ProductRepository repository,IDistributedCache cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        const string cacheKey = "products";

        var cachedProducts = await _cache.GetStringAsync(cacheKey);

        if (cachedProducts != null)
        {
            return JsonSerializer.Deserialize<List<Product>>(
                cachedProducts)!;
        }

        var products = await _repository.GetAllAsync();

        await _cache.SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(products),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            });

        return products;
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        var result = await _repository.AddAsync(product);

        await _cache.RemoveAsync("products");

        return result;
    }

    public async Task<Product?> UpdateAsync(int id, Product product)
    {
        var result = await _repository.UpdateAsync(id, product);

        await _cache.RemoveAsync("products");

        return result;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var result = await _repository.DeleteAsync(id);

        await _cache.RemoveAsync("products");

        return result;
    }
    public async Task<int?> GetStockAsync(int productId)
    {
        var product = await _repository.GetByIdAsync(productId);

        if (product == null)
            return null;

        return product.Stock;
    }
    public async Task<Product?> UpdateStockAsync(int productId, int stock)
    {
        var product = await _repository.GetByIdAsync(productId);

        if (product == null)
            return null;

        product.Stock = stock;

        return await _repository.UpdateAsync(productId, product);
    }
}