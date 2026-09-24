import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getProductById } from '../data/products'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'

export default function ProductDetails() {
  const { id } = useParams()
  const product = getProductById(id)
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="flex-1 py-10 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center py-16">
          <p className="text-gray-500 mb-4">This product could not be found.</p>
          <Link to="/products" className="bg-white border border-gray-300 hover:border-orange-500 font-semibold px-4 py-2.5 rounded-md text-sm">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  function handleAddToCart() {
    addItem(product, qty)
  }

  function handleBuyNow() {
    addItem(product, qty)
    navigate('/cart')
  }

  return (
    <div className="flex-1 py-10 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-gray-100 border border-gray-200 rounded-xl aspect-4/3 flex items-center justify-center text-gray-400">
            {product.category}
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl font-bold">{formatPrice(product.price)}</p>
            <p className="text-gray-500 my-4 max-w-md">{product.description}</p>
            <p className="text-sm text-gray-500 mb-5">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden mb-5">
              <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              <button
                className="bg-white border border-gray-300 hover:border-orange-500 font-semibold px-4 py-2.5 rounded-md text-sm disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to cart
              </button>
              <button
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-md text-sm disabled:opacity-50"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
