import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebase/auth';
import db from '../firebase/db';  // Corretta la sintassi senza parentesi graffe
import { doc, getDoc, updateDoc, arrayUnion, increment, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [missions, setMissions] = useState<any[]>([]);
  const [currentMission, setCurrentMission] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
        await loadUserData(u.uid);
        fetchMissions();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists()) {
      const data = userSnap.data();
      setCredits(data.credits ?? 0);
    }
  };

  const fetchMissions = async () => {
    const missionsSnap = await getDoc(doc(db, 'missions', 'activeMissions'));
    if (missionsSnap.exists()) {
      const data = missionsSnap.data();
      setMissions(data.missions || []);
      setCurrentMission(data.missions[0] || null);
    }
  };

  const handleComplete = async () => {
    if (!user || !currentMission) {
      console.log('User or mission is missing');
      return;
    }

    console.log('Completing mission:', currentMission);

    const userDocRef = doc(db, 'users', user.uid);

    // Controlla se l'utente ha già un documento
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      // Se il documento non esiste, creane uno
      console.log('No document found, creating new one...');
      await setDoc(userDocRef, {
        credits: currentMission.rewards,
        completedMissions: arrayUnion(currentMission.id),
        lastCompleted: serverTimestamp(),
      });
    } else {
      // Se il documento esiste, aggiorna i dati dell'utente
      await updateDoc(userDocRef, {
        credits: increment(currentMission.rewards),
        completedMissions: arrayUnion(currentMission.id),
        lastCompleted: serverTimestamp(),
      });
    }

    setCredits(prevCredits => prevCredits + currentMission.rewards);
    setCurrentMission(missions[missions.indexOf(currentMission) + 1] || null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Benvenuto, {user?.email}</h1>
        <p className="mb-6">Crediti: <span className="font-mono">{credits}</span></p>

        {currentMission ? (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="mb-2">Missione: {currentMission.url}</p>
            <a
              href={currentMission.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-yellow-400"
            >

