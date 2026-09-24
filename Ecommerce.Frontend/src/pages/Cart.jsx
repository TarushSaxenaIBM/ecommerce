import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="flex-1 py-10 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center py-16">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-md text-sm">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  const shipping = subtotal > 2000 ? 0 : 99
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  return (
    <div className="flex-1 py-10 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Your cart</h1>
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div className="bg-white border border-gray-200 rounded-xl px-5">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[64px_1fr_auto_auto_auto] items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
                <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                  {item.name.split(' ')[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="text-sm text-gray-500">{formatPrice(item.price)} each</div>
                </div>
                <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button className="w-7 h-7 bg-gray-100 hover:bg-gray-200" onClick={() => updateQty(item.id, item.qty - 1)}>
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.qty}</span>
                  <button className="w-7 h-7 bg-gray-100 hover:bg-gray-200" onClick={() => updateQty(item.id, item.qty + 1)}>
                    +
                  </button>
                </div>
                <div className="font-bold">{formatPrice(item.price * item.qty)}</div>
                <button className="text-sm text-gray-500 hover:text-gray-900" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold mb-3">Order summary</h3>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Tax (5%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between pt-3.5 mt-2 border-t border-gray-200 font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-md text-sm"
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
