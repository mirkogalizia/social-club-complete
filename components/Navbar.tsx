import Link from 'next/link'
<<<<<<< HEAD

export default function Navbar() {
  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-white text-xl font-semibold">
          Social Club
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition">Pacchetti VIP</Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white transition">Leaderboard</Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
=======
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
import auth from '../firebase/auth'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(!!u))
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  return (
    <nav className="bg-gradient-to-br from-gray-900 to-black shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/">
          <a className="text-white text-2xl font-bold hover:text-yellow-400 transition">
            Social Club
          </a>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/">
            <a
              className={`text-white hover:text-yellow-300 transition ${
                router.pathname === '/' ? 'underline' : ''
              }`}
            >
              Home
            </a>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <a
                  className={`text-white hover:text-yellow-300 transition ${
                    router.pathname === '/dashboard' ? 'underline' : ''
                  }`}
                >
                  Dashboard
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="text-yellow-400 font-semibold hover:text-yellow-200 transition"
              >
                Esci
              </button>
            </>
          ) : (
            <Link href="/login">
              <a
                className={`text-white hover:text-yellow-300 transition ${
                  router.pathname === '/login' ? 'underline' : ''
                }`}
              >
                Accedi
              </a>
            </Link>
          )}
>>>>>>> 7c8d206 (style: aggiornamento Navbar con tema scuro e link essenziali)
        </div>
      </div>
    </nav>
  )
}
