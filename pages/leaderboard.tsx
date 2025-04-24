import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import db from '../firebase/db';
import Link from 'next/link';

interface Score {
  id: string;
  displayName: string;
  photoURL: string;
  totalCredits: number;
}

export default function Leaderboard() {
  const [top, setTop] = useState<Score[]>([]);

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, 'scores'),
        orderBy('totalCredits', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      setTop(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>
        <ol className="space-y-4">
          {top.map((u, idx) => (
            <li key={u.id} className="flex items-center gap-4">
              <span className="text-xl w-6">{idx + 1}.</span>
              {u.photoURL ? (
                <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full" />
              )}
              <span className="flex-1">{u.displayName}</span>
              <span className="font-semibold">{u.totalCredits} 💎</span>
            </li>
          ))}
        </ol>
        <div className="text-center mt-6">
          <Link href="/dashboard" className="underline text-gray-400">
            ← Torna alla Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
