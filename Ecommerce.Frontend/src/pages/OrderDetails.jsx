import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

export default function OrderDetails() {
  const { id } = useParams()
  const { getOrderById } = useCart()
  const order = getOrderById(id)

  if (!order) {
    return (
      <div className="flex-1 py-10 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center py-16">
          <p className="text-gray-500 mb-4">This order could not be found.</p>
          <Link to="/orders" className="bg-white border border-gray-300 hover:border-orange-500 font-semibold px-4 py-2.5 rounded-md text-sm">
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-10 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-baseline justify-between mb-1">
          <h1 className="text-2xl font-bold">{order.id}</h1>
          <span className="bg-green-50 text-green-700 text-xs font-semibold rounded-full px-2.5 py-1">
            {order.status}
          </span>
        </div>
        <p className="text-gray-500 mb-7">Placed on {new Date(order.placedAt).toLocaleString()}</p>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold mb-2">Items</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-3 border-b border-gray-200 text-sm">
                <span>{item.name} × {item.qty}</span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 text-sm mt-1">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between pt-3.5 mt-2 border-t border-gray-200 font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold mb-3">Shipping address</h3>
            <p className="mb-1">{order.address.fullName}</p>
            <p className="text-gray-500">{order.address.line1}</p>
            <p className="text-gray-500">{order.address.city} — {order.address.pincode}</p>
            <h3 className="font-semibold mt-5 mb-1">Payment</h3>
            <p className="text-gray-500 capitalize">
              {order.paymentMethod === 'cod' ? 'Cash on delivery' : order.paymentMethod}
            </p>
          </div>
        </div>

        <Link to="/orders" className="inline-flex bg-white border border-gray-300 hover:border-orange-500 font-semibold px-4 py-2.5 rounded-md text-sm mt-7">
          Back to orders
        </Link>
      </div>
    </div>
  )
}
