// pages/api/admin/missions.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth }      from 'firebase-admin/auth'
import { db }           from '../../../firebase/admin'
import { Timestamp }    from 'firebase-admin/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🛠️  [missions] method:', req.method)

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const token = authHeader.split('Bearer ')[1]

    // Verifica token e admin-email
    const decoded = await getAuth().verifyIdToken(token)
    // fallback su NEXT_PUBLIC_ADMIN_EMAIL se ADMIN_EMAIL non è definita
    const adminEmail = process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL
    if (!decoded.email || decoded.email.toLowerCase() !== adminEmail?.toLowerCase()) {
      console.error(`🚫 [missions] user ${decoded.email} not authorized`)
      return res.status(403).json({ error: 'Forbidden: not an admin' })
    }

    // Estrai e valida body
    const { url, standard, gold, vip } = req.body as {
      url: string
      standard: number
      gold: number
      vip: number
    }
    if (!url || standard == null || gold == null || vip == null) {
      return res.status(400).json({ error: 'Missing required fields (url, standard, gold, vip)' })
    }

    // Scrivi su Firestore
    await db.collection('missions').add({
      url,
      rewards: { standard, gold, vip },
      createdAt: Timestamp.now(),
    })

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('🔥 [missions] unexpected error:', err)
    // restituisco sempre un JSON con il messaggio di errore
    return res
      .status(500)
      .json({ error: err.message ?? 'Internal Server Error' })
  }
}

