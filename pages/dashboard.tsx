import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import auth from '../firebase/auth';
import db from '../firebase/db';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Mission { image: string; link: string; reward: number; username?: string; }
interface Badge { id: string; title: string; iconUrl: string; criterionValue: number; }

const PLAN_LIMITS = { standard: 5, gold: 15, vip: 30 };

function isSameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function isNextDay(a: Date, b: Date) {
  const next=new Date(a); next.setDate(a.getDate()+1);
  return isSameDay(next,b);
}

async function updateScore(uid: string, added: number, profile: { displayName?:string; photoURL?:string }) {
  const ref = doc(db, 'scores', uid);
  await setDoc(ref, { displayName: profile.displayName||'Anonimo', photoURL: profile.photoURL||'', updatedAt: serverTimestamp() }, { merge:true });
  await updateDoc(ref, { totalCredits: increment(added) });
}

export default function Dashboard() {
  const [missions,setMissions]=useState<Mission[]>([]);
  const [currentIndex,setCurrentIndex]=useState(0);
  const [credits,setCredits]=useState(0);
  const [badges,setBadges]=useState<Badge[]>([]);
  const [unlocked,setUnlocked]=useState<Badge[]>([]);
  const [streak,setStreak]=useState(0);
  const [user,setUser]=useState<User|null>(null);
  const router=useRouter();
  const plan='vip'; const maxPerDay=PLAN_LIMITS[plan];

  useEffect(()=>{
    const unsub=onAuthStateChanged(auth, async u=>{
      if(!u) return router.replace('/login');
      setUser(u);
      const statRef=doc(db,'stats',u.uid);
      const statSnap=await getDoc(statRef);
      if(statSnap.exists()) setStreak(statSnap.data().streak||0);
    });
    fetch('/missions.json').then(r=>r.json()).then(setMissions);
    fetch('/badges.json').then(r=>r.json()).then(setBadges);
    return ()=>unsub();
  },[router]);

  const handleComplete=async()=>{
    if(currentIndex>=maxPerDay||!user) return;
    const next=currentIndex+1;
    setCredits(c=>c+missions[currentIndex].reward);
    setCurrentIndex(next);
    const newly=badges.filter(b=>next>=b.criterionValue);
    setUnlocked(newly);
    // streak
    const statRef=doc(db,'stats',user.uid);
    const statSnap=await getDoc(statRef);
    const today=new Date();
    let newStreak=1;
    if(statSnap.exists()){
      const data=statSnap.data();
      const last=(data.lastCompleted as Timestamp).toDate();
      if(isSameDay(last,today)) newStreak=data.streak;
      else if(isNextDay(last,today)) newStreak=(data.streak||0)+1;
      await updateDoc(statRef,{ streak:newStreak, lastCompleted:serverTimestamp() });
    } else {
      await setDoc(statRef,{ streak:1, lastCompleted:serverTimestamp() });
      newStreak=1;
    }
    setStreak(newStreak);
    // score
    await updateScore(user.uid, missions[currentIndex].reward, { displayName:user.displayName||undefined, photoURL:user.photoURL||undefined });
  };

  const mission=missions[currentIndex];
  if(!mission) return <div className="text-center mt-20 text-white">Hai completato tutte le missioni!</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">Pacchetto: <span className="font-semibold text-white">{plan.toUpperCase()}</span></p>
          <p className="text-sm text-gray-300">Missioni: <span className="font-semibold text-white">{currentIndex} / {maxPerDay}</span></p>
        </div>
        <p className="text-sm text-gray-300">📅 Streak: <span className="font-semibold text-white">{streak}</span> giorni</p>
        <div className="bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center">
          <img src={mission.image} alt="mission" className="rounded-xl mb-6 w-full h-48 object-cover" />
          {mission.username && <h3 className="text-2xl font-bold mb-2">@{mission.username}</h3>}
          <p className="text-sm text-gray-300 mb-4">Metti like a questo post per guadagnare <span className="font-semibold text-white">{mission.reward} crediti</span></p>
          <div className="flex gap-4">
            <a href={mission.link} target="_blank" rel="noopener" className="flex-1 py-3 rounded-full border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition">Vai a Instagram</a>
            <button onClick={handleComplete} disabled={currentIndex>=maxPerDay} className={`flex-1 py-3 rounded-full font-semibold ${currentIndex<maxPerDay?'bg-white text-black hover:bg-gray-200':'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>{currentIndex<maxPerDay?'Fatto':'Limite raggiunto'}</button>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">I tuoi Badge</h3>
          <div className="flex gap-4 overflow-x-auto">{unlocked.map(b=>(
            <div key={b.id} className="flex flex-col items-center"><img src={b.iconUrl} alt={b.title} className="w-16 h-16 mb-1" /><span className="text-xs text-gray-300">{b.title}</span></div>
          ))}</div>
        </div>
        <div className="text-center mt-4"><Link href="/leaderboard" className="text-sm text-yellow-400 hover:underline">Vedi la Leaderboard</Link></div>
        <button onClick={()=>{signOut(auth);router.replace('/login')}} className="w-full py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition">Logout</button>
        <p className="text-center text-sm text-gray-400">Crediti totali: <span className="font-semibold text-white">{credits}</span></p>
      </div>
    </div>
  );
}
