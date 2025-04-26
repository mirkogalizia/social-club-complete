// pages/api/admin/missions.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth }                 from 'firebase-admin/auth'
import { db }                      from '../../../firebase/admin'
import { Timestamp }               from 'firebase-admin/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🛠️  [missions] method:', req.method)

  // 1) Se è GET, restituisco un JSON di debug
  if (req.method === 'GET') {
    res.setHeader('Allow', ['GET','POST'])
    return res
      .status(200)
      .json({ message: 'Endpoint /api/admin/missions → usa POST con Bearer token per aggiungere missioni.' })
  }

  // 2) Se non è POST, 405
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET','POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  // 3) Solo POST da qui in poi
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const token = authHeader.split('Bearer ')[1]

    const decoded = await getAuth().verifyIdToken(token)
    if (decoded.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: not an admin' })
    }

    const { url, standard, gold, vip } = req.body as {
      url: string
      standard: number
      gold: number
      vip: number
    }
    if (!url || standard == null || gold == null || vip == null) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

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

