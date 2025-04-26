// pages/api/admin/missions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth }           from 'firebase-admin/auth'
import { db }                from '../../../firebase/admin'
import { Timestamp }         from 'firebase-admin/firestore'

const ALLOWED = ['OPTIONS', 'GET', 'POST']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🛠️ [missions] method:', req.method)

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', ALLOWED.join(','))
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .setHeader('Allow', ALLOWED.join(','))
    return res.status(200).end()
  }

  // GET for debug
  if (req.method === 'GET') {
    res
      .setHeader('Allow', ALLOWED.join(','))
      .setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).json({
      message: 'Endpoint /api/admin/missions → usa POST con Bearer token per aggiungere missioni.'
    })
  }

  // Only POST from here
  if (req.method !== 'POST') {
    res
      .setHeader('Allow', ALLOWED.join(','))
      .setHeader('Access-Control-Allow-Origin', '*')
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    // Auth header
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const token = header.split('Bearer ')[1]

    // Verify token & admin
    const decoded   = await getAuth().verifyIdToken(token)
    const adminEmail = process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL
    if (decoded.email?.toLowerCase() !== adminEmail?.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: not an admin' })
    }

    // Parse body
    const { url, standard, gold, vip } = req.body as {
      url: string
      standard: number
      gold: number
      vip: number
    }
    if (!url || standard == null || gold == null || vip == null) {
      return res.status(400).json({ error: 'Missing required fields: url, standard, gold, vip' })
    }

    // Write to Firestore
    await db.collection('missions').add({
      url,
      rewards: { standard, gold, vip },
      createdAt: Timestamp.now(),
    })

    res
      .setHeader('Access-Control-Allow-Origin', '*')
      .status(200)
      .json({ ok: true })
  } catch (e: any) {
    console.error('🔥 [missions] error:', e)
    res
      .setHeader('Access-Control-Allow-Origin', '*')
      .status(500)
      .json({ error: e.message || 'Internal Server Error' })
  }
}


