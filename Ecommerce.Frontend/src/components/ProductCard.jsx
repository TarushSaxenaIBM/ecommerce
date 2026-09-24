import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:border-orange-300 transition-colors">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-100 flex items-center justify-center text-sm text-gray-400 border-b border-gray-200">
          {product.category}
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-xs text-gray-500">{product.category}</span>
        <Link to={`/products/${product.id}`}>
          <span className="font-semibold text-sm text-gray-900">{product.name}</span>
        </Link>
        <span className="font-bold text-base mt-auto">{formatPrice(product.price)}</span>
        <button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm px-4 py-2 rounded-md mt-1"
          onClick={() => addItem(product, 1)}
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}
