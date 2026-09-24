import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const linkClass = ({ isActive }) =>
  `text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  function handleAuthClick() {
    if (user) {
      logout()
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-bold text-lg tracking-tight text-gray-900">
          Enterprise<span className="text-orange-600">Shop</span>
        </NavLink>
        <nav className="flex items-center gap-7">
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            Orders
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
            {count > 0 && (
              <span className="ml-1.5 bg-orange-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </NavLink>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900" onClick={handleAuthClick}>
            {user ? `Sign out (${user.name.split(' ')[0]})` : 'Sign in'}
          </button>
        </nav>
      </div>
    </header>
  )
}
