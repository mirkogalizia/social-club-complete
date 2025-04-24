import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '../firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch {
      setError('Errore durante la registrazione');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrati</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white" />
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <button onClick={handleSignup} className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200">Registrati</button>
        <p className="text-center mt-4 text-sm text-gray-400">Hai già un account? <Link href="/login" className="underline">Accedi</Link></p>
      </div>
    </div>
  );
}
