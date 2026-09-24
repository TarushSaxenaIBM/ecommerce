import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'

export default function Checkout() {
  const { items, subtotal, placeOrder } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: user?.name || '',
    line1: '',
    city: '',
    pincode: '',
    paymentMethod: 'card',
  })

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const shipping = subtotal > 2000 ? 0 : 99
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    const order = placeOrder({
      address: { fullName: form.fullName, line1: form.line1, city: form.city, pincode: form.pincode },
      paymentMethod: form.paymentMethod,
    })
    navigate(`/orders/${order.id}`)
  }

  const inputClass =
    'bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'

  return (
    <div className="flex-1 py-10 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <form className="max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
            <h3 className="font-semibold">Shipping address</h3>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-sm text-gray-500">Full name</label>
              <input id="fullName" className={inputClass} required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="line1" className="text-sm text-gray-500">Address</label>
              <input id="line1" className={inputClass} required value={form.line1} onChange={(e) => update('line1', e.target.value)} />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="city" className="text-sm text-gray-500">City</label>
                <input id="city" className={inputClass} required value={form.city} onChange={(e) => update('city', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="pincode" className="text-sm text-gray-500">Pincode</label>
                <input id="pincode" className={inputClass} required value={form.pincode} onChange={(e) => update('pincode', e.target.value)} />
              </div>
            </div>

            <h3 className="font-semibold mt-2">Payment</h3>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="paymentMethod" className="text-sm text-gray-500">Method</label>
              <select id="paymentMethod" className={inputClass} value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
                <option value="card">Credit / debit card</option>
                <option value="upi">UPI</option>
                <option value="cod">Cash on delivery</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">This is a demo checkout — no real payment is processed.</p>
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-md text-sm w-full">
              Place order
            </button>
          </form>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold mb-3">Order summary</h3>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-3 border-b border-gray-200 text-sm">
                <span>{item.name} × {item.qty}</span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 text-sm mt-1">
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
          </div>
        </div>
      </div>
    </div>
  )
}
