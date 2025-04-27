// pages/signup.tsx
import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase/auth'


const plans = [
  {
    id: 'standard',
    name: 'Standard',
    price: '€5 una tantum',
    perks: ['5 like gratuiti', 'Badge base', 'Accesso leaderboard'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '€15 una tantum',
    perks: ['15 like gratuiti', 'Badge avanzati', 'Notifiche email'],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '€30 una tantum',
    perks: ['30 like gratuiti', 'Tutti i badge esclusivi', 'Report giornaliero'],
  },
]

export default function Signup() {
  const router = useRouter()
  const [step, setStep] = useState<'plan' | 'form'>('plan')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handlePlanClick = (id: string) => {
    setSelectedPlan(id)
    setStep('form')
    setError('')
  }

  const handleSignup = async () => {
    if (password !== confirm) {
      setError('Le password non corrispondono.')
      return
    }
    if (!firstName || !lastName || !phone) {
      setError('Compila tutti i campi.')
      return
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, {
        displayName: `${firstName} ${lastName}`,
      })
      // TODO: salva phone e selectedPlan in Firestore qui, se ti serve
      router.push('/dashboard')
    } catch (e:any) {
      setError(e.message)
    }
  }

  return (
    <>
      <Head>
        <title>Registrati – Social Club</title>
      </Head>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        {step === 'plan' && (
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Scegli il tuo piano</h1>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map(plan => (
                <motion.div
                  key={plan.id}
                  className={`p-6 rounded-xl shadow-lg cursor-pointer ${
                    selectedPlan === plan.id ? 'ring-4 ring-yellow-400' : 'ring-1 ring-gray-700'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handlePlanClick(plan.id)}
                >
                  <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                  <p className="text-xl text-yellow-400 mb-4">{plan.price}</p>
                  <ul className="space-y-1 text-gray-300">
                    {plan.perks.map((p,i) => <li key={i}>• {p}</li>)}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {step === 'form' && selectedPlan && (
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Piano scelto: {plans.find(p => p.id === selectedPlan)?.name}
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none"
              />
              <input
                type="text"
                placeholder="Cognome"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Telefono"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none"
              />
              <input
                type="password"
                placeholder="Conferma Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none"
              />
            </div>
            <button
              onClick={handleSignup}
              className="mt-6 w-full bg-yellow-500 text-black py-3 rounded font-semibold hover:bg-yellow-600"
            >
              Registrati
            </button>
            <button
              onClick={() => { setStep('plan'); setError('') }}
              className="mt-4 w-full text-gray-400 underline"
            >
              ← Cambia piano
            </button>
          </div>
        )}
      </div>
    </>
  )
}
