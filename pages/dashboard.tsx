import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '../firebase/auth'
import { db } from '../firebase/db'
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState<User|null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [missions, setMissions] = useState<any[]>([])
  const [completedMissions, setCompletedMissions] = useState<string[]>([])
  const [currentMission, setCurrentMission] = useState<any|null>(null)
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, async u => {
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
        await loadUserData(u.uid)
        await fetchMissions(u.uid)
      }
    })
  }, [])

  const loadUserData = async (uid: string) => {
    const userSnap = await getDoc(doc(db, 'users', uid))
    if (userSnap.exists()) {
      const data = userSnap.data()
      setCredits(data.credits ?? 0)
      setCompletedMissions(data.completedMissions ?? [])
    }
  }

  const fetchMissions = async (uid: string) => {
    try {
      const res = await fetch('/api/admin/missions')
      const allMissions = await res.json()

      // Filtra missioni non completate
      const incompleteMissions = allMissions.filter(
        mission => !completedMissions.includes(mission.id)
      )

      setMissions(incompleteMissions)
      setCurrentMission(incompleteMissions[0] ?? null)
    } catch (error) {
      console.error('Errore caricamento missioni', error)
    }
  }

  const handleComplete = async () => {
    if (!user || !currentMission) return

    const userDocRef = doc(db, 'users', user.uid)

    await updateDoc(userDocRef, {
      credits: credits + currentMission.rewards,
      completedMissions: arrayUnion(currentMission.id),
      lastCompleted: serverTimestamp(),
    })

    setCredits(c => c + currentMission.rewards)
    setCompletedMissions([...completedMissions, currentMission.id])

    const remainingMissions = missions.filter(m => m.id !== currentMission.id)
    setMissions(remainingMissions)
    setCurrentMission(remainingMissions[0] ?? null)
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Benvenuto, {user.email}</h1>
        <p className="mb-6">Crediti: <span>{credits}</span></p>

        {currentMission ? (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="mb-2">Missione:</p>
            <a href={currentMission.url} target="_blank" className="underline text-yellow-400">
              Vai al link Instagram
            </a>
            <p className="mt-2">Ricompensa: {currentMission.rewards} crediti</p>
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

