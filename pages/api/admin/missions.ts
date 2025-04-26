// pages/api/admin/missions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { db }                             from '../../../firebase/admin'
import { getAuth }                        from 'firebase-admin/auth'
import { Timestamp }                      from 'firebase-admin/firestore'

const ADMIN_UID = process.env.ADMIN_UID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization?.split('Bearer ')[1]
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing token' })
  }

  try {
    const { uid } = await getAuth().verifyIdToken(authHeader)
    if (uid !== ADMIN_UID) {
      return res.status(403).json({ error: 'Forbidden' })
    }
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { url, standard, gold, vip } = req.body as {
    url:      string
    standard: number
    gold:     number
    vip:      number
  }

  if (!url || standard == null || gold == null || vip == null) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  await db.collection('missions').add({
    url,
    rewards: { standard, gold, vip },
    createdAt: Timestamp.now(),
  })

  return res.status(200).json({ ok: true })
}
