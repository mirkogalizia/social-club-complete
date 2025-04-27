// pages/admin/login.tsx
import { useState, FormEvent } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/auth'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      if (cred.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        throw new Error('Non autorizzato')
      }
      router.push('/admin/missions')
    } catch (err: any) {
      setError(err.message || 'Errore di login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        {error && <p className="bg-red-600 p-2 rounded mb-4">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700 focus:outline-none"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded font-semibold transition ${
            isLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-400 text-black'
          }`}
        >
          {isLoading ? 'Caricamento...' : 'Accedi'}
        </button>
      </form>
    </div>
  )
}

