// pages/dashboard.tsx
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '../firebase/auth'
import { db } from '../firebase/db'
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  increment,
  DocumentData
} from 'firebase/firestore'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState<User|null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [missions, setMissions] = useState<DocumentData[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
        loadUserData(u.uid)
      }
    })
    return () => unsubscribe()
  }, [])

  const loadUserData = async (uid: string) => {
    const userSnap = await getDoc(doc(db, 'users', uid))
    if (userSnap.exists()) {
      const data = userSnap.data()
      setCredits(data.credits ?? 0)
      setMissions(data.missions ?? [])
    }
  }

  const handleComplete = async () => {
    if (!user) return
    const mission = missions[currentIndex]
    const newCredits = credits + mission.reward
    await updateDoc(doc(db, 'users', user.uid), {
      credits: newCredits,
      lastCompleted: serverTimestamp()
    })
    setCredits(newCredits)
    setCurrentIndex(i => i + 1)
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  if (!user) return null  // o un loader

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Benvenuto, {user.email}</h1>
        <p className="mb-6">Crediti: <span className="font-mono">{credits}</span></p>

        {missions[currentIndex] ? (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="mb-2">Missione #{currentIndex + 1}:</p>
            <a
              href={missions[currentIndex].url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-yellow-400"
            >
              Vai al link
            </a>
            <p className="mt-2">Ricompensa: {missions[currentIndex].reward} crediti</p>
            <button
              onClick={handleComplete}
              className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition"
            >
              Fatto!
            </button>
          </div>
        ) : (
          <p className="text-center">Hai completato tutte le missioni 🎉</p>
        )}

        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 bg-red-600 rounded hover:bg-red-500 transition"
        >
          Esci
        </button>
      </div>
    </div>
  )
}

