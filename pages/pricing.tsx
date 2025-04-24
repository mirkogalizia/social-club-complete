// pages/pricing.tsx
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Pricing() {
  const router = useRouter()
  const { plan } = router.query as { plan?: string }
  const [label, setLabel] = useState<{ name: string; eur: number }>({ name: '', eur: 0 })

  useEffect(() => {
    if (!plan) return
    switch (plan) {
      case 'standard':
        setLabel({ name: 'Standard', eur: 5 })
        break
      case 'gold':
        setLabel({ name: 'Gold', eur: 15 })
        break
      case 'vip':
        setLabel({ name: 'VIP', eur: 30 })
        break
      default:
        router.replace('/')
    }
  }, [plan, router])

  if (!plan) return <p className="p-8 text-white">Loading…</p>

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Conferma {label.name}</h1>
      <p className="text-2xl mb-4">
        Prezzo: <span className="font-semibold">{label.eur} € (one-time)</span>
      </p>
      <p className="mb-8">Dopo il pagamento riceverai {label.eur} like da spendere quando vuoi.</p>
      <div className="flex gap-4">
        <Link href="/">
          <a className="px-6 py-3 border border-gray-500 rounded hover:bg-gray-700 transition">Annulla</a>
        </Link>
        <button
          onClick={() => {
            // qui invochi il tuo flow: Coinbase Commerce / BTCPay / on-chain
            router.push(`/api/create-invoice?plan=${plan}&amount=${label.eur}`)
          }}
          className="px-6 py-3 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition"
        >
          Paga ora
        </button>
      </div>
    </div>
  )
}
