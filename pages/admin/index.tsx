// pages/admin/index.tsx
import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import auth from '../../firebase/auth'
import { useRouter } from 'next/router'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [url, setUrl] = useState('')
  const [std, setStd] = useState(1)
  const [gold, setGold] = useState(2)
  const [vip, setVip] = useState(3)
  const [msg, setMsg] = useState('')

  // Protegge la pagina: solo admin può restare
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), u => {
      if (!u) {
        router.replace('/admin/login')
      } else if (u.email?.toLowerCase() !== process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()) {
        signOut(auth).then(() => router.replace('/admin/login'))
      } else {
        setUser(u)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleSubmit = async () => {
    if (!url.trim()) {
      setMsg('❌ Inserisci un URL valido')
      return
    }
    setMsg('⏳ Caricamento…')
    try {
      const token = await user.getIdToken()
      const res = await fetch('/api/admin/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, standard: std, gold, vip }),
      })

      // Legge sempre il testo di risposta
      const text = await res.text()
      let data: { ok?: boolean; error?: string } = {}
      try {
        data = JSON.parse(text)
      } catch {
        data.error = text || res.statusText
      }

      if (res.ok && data.ok) {
        setMsg('✅ Missione aggiunta!')
        setUrl(''); setStd(1); setGold(2); setVip(3)
      } else {
        setMsg(`❌ Errore: ${data.error || res.status}`)
      }
    } catch (e: any) {
      console.error('Fetch error:', e)
      setMsg(`❌ Errore di rete: ${e.message || e}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎛️ Pannello Admin</h1>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block mb-1 font-medium">URL Instagram</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://instagram.com/p/..."
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Standard</label>
            <input
              type="number"
              value={std}
              onChange={e => setStd(+e.target.value)}
              className="w-full p-2 rounded bg-gray-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gold</label>
            <input
              type="number"
              value={gold}
              onChange={e => setGold(+e.target.value)}
              className="w-full p-2 rounded bg-gray-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">VIP</label>
            <input
              type="number"
              value={vip}
              onChange={e => setVip(+e.target.value)}
              className="w-full p-2 rounded bg-gray-800 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-600 transition"
        >
          Aggiungi Missione
        </button>
        {msg && <p className="mt-2">{msg}</p>}
      </div>
    </div>
  )
}

