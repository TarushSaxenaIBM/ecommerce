import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'es_cart'
const ORDERS_KEY = 'es_orders'

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty }]
    })
  }

  function updateQty(id, qty) {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  function placeOrder({ address, paymentMethod }) {
    const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99
    const tax = Math.round(subtotal * 0.05)
    const total = subtotal + shipping + tax
    const order = {
      id: 'ORD' + Date.now().toString().slice(-8),
      items,
      subtotal,
      shipping,
      tax,
      total,
      address,
      paymentMethod,
      status: 'Placed',
      placedAt: new Date().toISOString(),
    }
    const orders = readOrders()
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]))
    clearCart()
    return order
  }

  function getOrders() {
    return readOrders()
  }

  function getOrderById(id) {
    return readOrders().find((o) => o.id === id)
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, subtotal, count, placeOrder, getOrders, getOrderById }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
