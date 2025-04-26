// pages/api/admin/missions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth }                 from 'firebase-admin/auth'
import { db }                      from '../../../firebase/admin'
import { Timestamp }               from 'firebase-admin/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1) Metodo consentito solo POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // 2) Autenticazione: token Bearer nel header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const token = authHeader.split('Bearer ')[1]

    // 3) Verifica token e controllo email admin
    const decoded = await getAuth().verifyIdToken(token)
    if (decoded.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: not an admin' })
    }

    // 4) Estrai e valida body
    const { url, standard, gold, vip } = req.body as {
      url: string
      standard: number
      gold: number
      vip: number
    }
    if (!url || standard == null || gold == null || vip == null) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 5) Scrivi in Firestore
    await db.collection('missions').add({
      url,
      rewards: { standard, gold, vip },
      createdAt: Timestamp.now(),
    })

    // 6) Risposta OK
    return res.status(200).json({ ok: true })

  } catch (error: any) {
    console.error('🔥 [missions] unexpected error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
