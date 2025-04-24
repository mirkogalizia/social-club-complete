import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import auth from '../firebase/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard') // ✅ Redirect corretto
    } catch (err) {
      setError('Email o password non corretti')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Accedi</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
        />
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition"
        >
          Entra
        </button>
        <p className="text-center mt-4 text-sm text-gray-400">
          Non hai un account?{' '}
          <Link href="/signup" className="text-white underline">Registrati</Link>
        </p>
      </div>
    </div>
  )
}
