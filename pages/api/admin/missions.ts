// pages/api/admin/missions.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth }                 from 'firebase-admin/auth'
import { db }                      from '../../../firebase/admin'
import { Timestamp }               from 'firebase-admin/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // DEBUG: qual è il metodo che arriva?
  console.log('🛠️  [missions] method:', req.method)

  // Accettiamo soltanto POST per creare missioni
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    // 1) Token Bearer in header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const token = authHeader.split('Bearer ')[1]

    // 2) Verifica del token e controllo email admin
    const decoded = await getAuth().verifyIdToken(token)
    if (decoded.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: not an admin' })
    }

    // 3) Estrai e valida i campi dal body
    const { url, standard, gold, vip } = req.body as {
      url: string
      standard: number
      gold: number
      vip: number
    }
    if (!url || standard == null || gold == null || vip == null) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 4) Scrivi su Firestore
    await db.collection('missions').add({
      url,
      rewards: { standard, gold, vip },
      createdAt: Timestamp.now(),
    })

    // 5) Risposta OK
    return res.status(200).json({ ok: true })
  } catch (error: any) {
    console.error('🔥 [missions] unexpected error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}


