import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import auth from '../firebase/auth';
import { useRouter } from 'next/router';

interface Mission { image: string; link: string; reward: number; username?: string; }

const PLAN_LIMITS = { standard: 5, gold: 15, vip: 30 };

export default function Dashboard() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [credits, setCredits] = useState(0);
  const router = useRouter();
  const userPlan = 'vip'; // TODO: fetch from user profile
  const maxPerDay = PLAN_LIMITS[userPlan];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) router.replace('/login');
    });
    fetch('/missions.json')
      .then(r => r.json())
      .then(setMissions);
    return () => unsub();
  }, [router]);

  const handleComplete = () => {
    if (currentIndex >= maxPerDay) return;
    setCredits(prev => prev + missions[currentIndex].reward);
    setCurrentIndex(prev => prev + 1);
  };

  const mission = missions[currentIndex];
  if (!mission) {
    return <div className="text-center mt-20 text-white">Hai completato tutte le missioni!</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">Pacchetto: <span className="font-semibold text-white">{userPlan.toUpperCase()}</span></p>
          <p className="text-sm text-gray-300">Missioni: <span className="font-semibold text-white">{currentIndex} / {maxPerDay}</span></p>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center">
          <img src={mission.image} alt="mission" className="rounded-xl mb-6 w-full h-48 object-cover" />
          {mission.username && <h3 className="text-2xl font-bold mb-2">@{mission.username}</h3>}
          <p className="text-sm text-gray-300 mb-4">
            Metti like a questo post per guadagnare <span className="font-semibold text-white">{mission.reward} crediti</span>
          </p>
          <div className="flex gap-4">
            <a href={mission.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-full border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition">
              Vai a Instagram
            </a>
            <button onClick={handleComplete} disabled={currentIndex >= maxPerDay} className={`flex-1 py-3 rounded-full font-semibold ${currentIndex < maxPerDay ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
              {currentIndex < maxPerDay ? 'Fatto' : 'Limite raggiunto'}
            </button>
          </div>
        </div>
        <button onClick={() => { signOut(auth); router.replace('/login'); }} className="w-full py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
          Logout
        </button>
        <p className="text-center text-sm text-gray-400">Crediti totali: <span className="font-semibold text-white">{credits}</span></p>
      </div>
    </div>
  );
}
