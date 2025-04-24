import { useEffect, useState } from 'react'

interface Mission {
  id: number
  image: string
  link: string
  reward: number
}

export default function Dashboard() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    fetch('/missions.json')
      .then(res => res.json())
      .then(data => setMissions(data))
  }, [])

  const handleComplete = () => {
    setCredits(credits + missions[currentIndex].reward)
    setCurrentIndex(prev => (prev + 1 < missions.length ? prev + 1 : prev))
  }

  if (missions.length === 0) {
    return <div className="text-white text-center mt-20">Nessuna missione disponibile</div>
  }

  const mission = missions[currentIndex]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Missione del giorno</h2>
        <img src={mission.image} alt="mission" className="rounded mb-4 w-full h-auto" />
        <a
          href={mission.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline block mb-4"
        >
          Vai al post Instagram
        </a>
        <button
          onClick={handleComplete}
          className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-300 transition"
        >
          Fatto ✅ (+{mission.reward} crediti)
        </button>
        <p className="mt-4 text-sm text-gray-400">Crediti totali: {credits}</p>
      </div>
    </div>
  )
}
