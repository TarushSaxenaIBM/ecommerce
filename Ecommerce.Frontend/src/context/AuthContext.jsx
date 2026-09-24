import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'es_users'
const SESSION_KEY = 'es_session'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY))
      if (session) setUser(session)
    } catch {
      // ignore corrupt session
    }
  }, [])

  function register({ name, email, password }) {
    const users = readUsers()
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = { name, email, password }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
    const session = { name, email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function login({ email, password }) {
    const users = readUsers()
    const match = users.find((u) => u.email === email && u.password === password)
    if (!match) {
      return { ok: false, error: 'Incorrect email or password.' }
    }
    const session = { name: match.name, email: match.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
