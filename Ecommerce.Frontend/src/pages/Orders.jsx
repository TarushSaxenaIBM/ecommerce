import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

export default function Orders() {
  const { getOrders } = useCart()
  const orders = getOrders()

  if (orders.length === 0) {
    return (
      <div className="flex-1 py-10 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center py-16">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-md text-sm">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-10 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Your orders</h1>
        {orders.map((order) => (
          <Link
            to={`/orders/${order.id}`}
            key={order.id}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-3.5 flex items-center justify-between gap-4 hover:border-orange-300"
          >
            <div>
              <div className="font-semibold">{order.id}</div>
              <div className="text-sm text-gray-500">
                {new Date(order.placedAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </div>
            </div>
            <span className="bg-green-50 text-green-700 text-xs font-semibold rounded-full px-2.5 py-1">
              {order.status}
            </span>
            <div className="font-bold">{formatPrice(order.total)}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
