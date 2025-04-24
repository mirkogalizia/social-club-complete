import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import auth from '../firebase/auth';
import { useRouter } from 'next/router';

interface Mission { image: string; link: string; reward: number; }

export default function Dashboard() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [credits, setCredits] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) router.push('/login');
    });
    fetch('/missions.json')
      .then(r => r.json())
      .then(setMissions);
    return () => unsub();
  }, [router]);

  const handleComplete = () => {
    if (!missions[currentIndex]) return;
    setCredits(prev => prev + missions[currentIndex].reward);
    setCurrentIndex(prev => prev + 1);
  };

  const mission = missions[currentIndex];
  if (!mission) {
    return (
      <div className="text-center mt-20 text-white">
        Hai completato tutte le missioni!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <img
          src={mission.image}
          alt="mission"
          className="rounded mb-4 w-full"
        />
        <a
          href={mission.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline mb-4 block"
        >
          Apri post Instagram
        </a>
        <button
          onClick={handleComplete}
          className="w-full bg-white text-black py-2 rounded mb-2 hover:bg-gray-200"
        >
          Fatto (+{mission.reward} crediti)
        </button>
        <button
          onClick={() => {
            signOut(auth);
            router.push('/login');
          }}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
        <p className="mt-4 text-sm text-gray-400">Crediti: {credits}</p>
      </div>
    </div>
  );
}
