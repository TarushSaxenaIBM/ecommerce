import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    const result = register({ name, email, password })
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/')
  }

  return (
    <div className="flex-1 py-10 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Create an account</h1>
        <form className="max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-md px-3.5 py-2.5 text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm text-gray-500">
              Full name
            </label>
            <input
              id="name"
              className="bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-gray-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-gray-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-md text-sm w-full">
            Create account
          </button>
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
