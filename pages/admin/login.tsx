// pages/admin/login.tsx
import { useState } from 'react'
import { signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import auth from '../../firebase/auth'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const user = getAuth().currentUser!
      // Controllo email admin
      if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        await signOut(auth)
        setError('Non sei autorizzato ad accedere al pannello Admin.')
        return
      }
      router.push('/admin')
    } catch (err) {
      setError('Email o password non corretti.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
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
          type="submit"
          className="w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-600 transition"
        >
          Accedi
        </button>
      </form>
    </div>
  )
}
