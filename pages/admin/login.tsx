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
      // Effettua il login
      await signInWithEmailAndPassword(auth, email, password)
      const user = auth.currentUser!
      // Debug: stampa in console i valori
      console.log('🛠️  Logged in user.email:', user.email)
      console.log('🛠️  Expected admin email:', process.env.NEXT_PUBLIC_ADMIN_EMAIL)

      // Controllo case-insensitive dell’email admin
      const loggedEmail = user.email?.toLowerCase() || ''
      const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase()
      if (loggedEmail !== adminEmail) {
        await signOut(auth)
        setError('⚠️ Non sei autorizzato ad accedere al pannello Admin.')
        return
      }

      // Se tutto ok, vai al pannello Admin
      router.push('/admin')
    } catch (err) {
      console.error(err)
      setError('❌ Email o password non corretti.')
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

