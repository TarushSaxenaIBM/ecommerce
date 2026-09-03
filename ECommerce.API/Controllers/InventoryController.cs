using ECommerce.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly ProductService _productService;

    public InventoryController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> GetStock(int productId)
    {
        var stock = await _productService.GetStockAsync(productId);

        if (stock == null)
            return NotFound();

        return Ok(new
        {
            ProductId = productId,
            Stock = stock
        });
    }

    [HttpPut("{productId}")]
    public async Task<IActionResult> UpdateStock(
        int productId,
        int stock)
    {
        if (stock < 0)
            return BadRequest("Stock cannot be negative.");

        var product = await _productService.UpdateStockAsync(productId, stock);

        if (product == null)
            return NotFound();

        return Ok(product);
    }
}