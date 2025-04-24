import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import auth from '../firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) router.replace('/dashboard');
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/dashboard');
    } catch (err: any) {
      console.error('Firebase login error:', err.code, err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Accedi</h2>
        <input name="email" autoComplete="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white"/>
        <input name="password" autoComplete="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white"/>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <button type="submit" className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200">Entra</button>
        <p className="text-center mt-4 text-sm text-gray-400">Non hai un account? <Link href="/signup" className="underline text-white">Registrati</Link></p>
      </form>
    </div>
);
}
