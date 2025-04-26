// pages/api/admin/missions.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth }              from 'firebase-admin/auth'
import { db }                   from '../../../firebase/admin'
import { Timestamp }            from 'firebase-admin/firestore'

const ALLOWED = ['OPTIONS', 'GET', 'POST']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 0) CORS-preflight (solo se servisse)
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', ALLOWED)
    return res.status(200).end()
  }

  // 1) Se arriva GET, restituisci un JSON di debug
  if (req.method === 'GET') {
    res.setHeader('Allow', ALLOWED)
    return res
      .status(200)
      .json({ message: 'Endpoint /api/admin/missions: usa POST per aggiungere missioni.' })
  }

  // 2) Solo POST da qui in poi
  if (req.method !== 'POST') {
    res.setHeader('Allow', ALLOWED)
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    // 3) Controlla header Authorization
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const token = authHeader.split('Bearer ')[1]

    // 4) Verifica il token Firebase e che l’email sia proprio la tua
    const decoded = await getAuth().verifyIdToken(token)
    if (decoded.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: not an admin' })
    }

    // 5) Estrai e valida i campi
    const { url, standard, gold, vip } = req.body as {
      url: string
      standard: number
      gold: number
      vip: number
    }
    if (!url || standard == null || gold == null || vip == null) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 6) Scrivi in Firestore
    await db.collection('missions').add({
      url,
      rewards: { standard, gold, vip },
      createdAt: Timestamp.now(),
    })

    return res.status(200).json({ ok: true })
  } catch (error: any) {
    console.error('🔥 [missions] unexpected error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}

