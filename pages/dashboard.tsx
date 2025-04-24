import { useState } from 'react'

interface Mission {
  imageUrl: string
  postUrl: string
  username: string
  reward: number
}

export default function Dashboard() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [credits, setCredits] = useState(0)

  useState(() => {
    fetch('/missions.json')
      .then(res => res.json())
      .then(data => setMissions(data))
  }, [])

  const handleComplete = () => {
    setCredits(credits + missions[currentIndex].reward)
    setCurrentIndex(currentIndex + 1)
  }

  const current = missions[currentIndex]

  if (!current) return <p className="text-center mt-10 text-white">Hai completato tutte le missioni di oggi!</p>

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <img src={current.imageUrl} alt="Post" className="rounded w-full mb-4" />
        <p className="mb-2">@{current.username}</p>
        <a href={current.postUrl} target="_blank" className="text-blue-400 underline mb-4 block">Apri post su Instagram</a>
        <button onClick={handleComplete} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Fatto</button>
        <p className="mt-4 text-sm">Crediti guadagnati: {credits}</p>
        <p className="text-sm text-gray-400">Missione {currentIndex + 1} / {missions.length}</p>
      </div>
    </div>
  )
}