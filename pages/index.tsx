// pages/index.tsx
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import auth from '../firebase/auth'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: '€5/mese',
      perks: ['5 like/giorno', 'Badge base', 'Leaderboard'],
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '€15/mese',
      perks: ['15 like/giorno', 'Badge avanzati', 'Leaderboard Premium', 'Notifiche email'],
    },
    {
      id: 'vip',
      name: 'VIP',
      price: '€30/mese',
      perks: ['30 like/giorno', 'Tutti i badge esclusivi', 'Report giornalieri', 'Assistenza prioritaria'],
    },
  ]

  const handleSubscribe = (planId: string) => {
    if (!user) {
      // Se non loggato, vai a signup e poi rimanda al pricing
      router.push(`/signup?redirect=/pricing?plan=${planId}`)
    } else {
      router.push(`/pricing?plan=${planId}`)
    }
  }

  return (
    <>
      <Head>
        <title>Social Club – Scegli il tuo piano</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center p-8">
        <h1 className="text-5xl font-extrabold text-white mb-12 drop-shadow-lg">
          Scegli il tuo piano
        </h1>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 w-full max-w-6xl">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              className="relative bg-gray-800 p-8 rounded-3xl shadow-2xl flex flex-col justify-between"
              whileHover={{ scale: 1.05, rotateX: 3, rotateY: -3, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div>
                <h2 className="text-3xl font-semibold text-white mb-4">{plan.name}</h2>
                <p className="text-5xl font-bold text-yellow-400 mb-6">{plan.price}</p>
                <ul className="space-y-2 mb-6">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 
                             1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSubscribe(plan.id)}
                className="mt-4 w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 
                          text-black font-semibold rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-700 
                          transform hover:-translate-y-1 transition flex items-center justify-center"
              >
                Sottoscrivi
                <svg
                  className="w-5 h-5 ml-2 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              {plan.id === 'vip' && (
                <span className="absolute -top-3 -right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  Hot 🔥
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
