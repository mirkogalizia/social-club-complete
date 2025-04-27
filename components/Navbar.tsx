// components/Navbar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../firebase/auth'  // ← named import, non default
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Tiene traccia dello stato di autenticazione
    const unsubscribe = onAuthStateChanged(auth, u => setUser(u))
    return () => unsubscribe()
  }, [])

  const linkClasses = (active: boolean) =>
    `px-4 py-2 rounded-full font-medium transition ${
      active
        ? 'bg-yellow-500 text-black'
        : 'bg-transparent text-white hover:bg-gray-700'
    }`

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  return (
    <nav className="bg-gradient-to-br from-gray-900 to-black shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo / Brand */}
        <Link href="/">
          <a className="text-2xl font-bold text-white hover:text-yellow-400 transition">
            Social Club
          </a>
        </Link>

        {/* Links / Pulsanti */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className={linkClasses(router.pathname === '/')}>Home</a>
          </Link>

          {user ? (
            <>
              <Link href="/dashboard">
                <a className={linkClasses(router.pathname === '/dashboard')}>
                  Dashboard
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-500 transition"
              >
                Esci
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className={linkClasses(router.pathname === '/login')}>
                  Accedi
                </a>
              </Link>
              <Link href="/signup">
                <a className={linkClasses(router.pathname === '/signup')}>
                  Registrati
                </a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

