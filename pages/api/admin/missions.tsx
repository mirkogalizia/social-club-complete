// pages/admin/missions.tsx
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../../firebase/auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'

interface Mission {
  id: string
  url: string
  rewards: number
  createdAt: any
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [url, setUrl] = useState('')
  const [rewards, setRewards] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push('/admin')
      } else {
        fetchMissions()
      }
    })
    return () => unsubscribe()
  }, [router])

  const fetchMissions = async () => {
    try {
      const res = await fetch('/api/admin/missions')
      const data = await res.json()
      setMissions(data)
    } catch (err) {
      console.error('Errore caricamento missioni', err)
    }
  }

  const handleAddMission = async (e: FormEvent) => {
    e.preventDefault()
    if (!url || rewards <= 0) return
    setLoading(true)
    try {
      await fetch('/api/admin/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, rewards }),
      })
      setUrl('')
      setRewards(0)
      fetchMissions() // Ricarica missioni
    } catch (err) {
      console.error('Errore creazione missione', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestione Missioni</h1>

        {/* Form Aggiunta */}
        <form onSubmit={handleAddMission} className="bg-gray-800 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Aggiungi Nuova Missione</h2>
          <input
            type="text"
            placeholder="URL missione (Instagram)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded bg-gray-700 focus:outline-none"
            required
          />
          <input
            type="number"
            placeholder="Ricompensa (crediti)"
            value={rewards}
            onChange={e => setRewards(parseInt(e.target.value))}
            className="w-full mb-3 px-3 py-2 rounded bg-gray-700 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded transition"
          >
            {loading ? 'Caricamento...' : 'Aggiungi Missione'}
          </button>
        </form>

        {/* Lista Missioni */}
        <div className="space-y-4">
          {missions.map(mission => (
            <div key={mission.id} className="bg-gray-800 p-4 rounded-lg">
              <a href={mission.url} target="_blank" rel="noopener noreferrer" className="underline text-yellow-400">
                {mission.url}
              </a>
              <p>Ricompensa: {mission.rewards} crediti</p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 bg-red-600 hover:bg-red-500 rounded transition"
        >
          Esci
        </button>
      </div>
    </div>
  )
}
