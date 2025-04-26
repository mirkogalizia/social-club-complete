// pages/api/admin/missions.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { getApps, initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

/** Inizializza Firebase Admin SDK una sola volta */
function initAdmin() {
  if (!getApps().length) {
    const projectId   = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    // Converti i '\n' letterali in vere newline
    const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase Admin environment variables')
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey } as ServiceAccount),
    })
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🛠️ [missions] ENTER handler, method=', req.method)

  // 1) Init Admin SDK
  try {
    initAdmin()
    console.log('🛠️ [missions] Admin SDK initialized')
  } catch (e: any) {
    console.error('🔥 [missions] init error:', e)
    return res.status(500).json({ error: 'Init error: ' + e.message })
  }

  // 2) Autorizzazione: Bearer ID token Firebase
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' })
  }
  const idToken = authHeader.split('Bearer ')[1]

  let decodedToken: any
  try {
    decodedToken = await getAuth().verifyIdToken(idToken)
  } catch (e: any) {
    console.error('🔥 [missions] token verify error:', e)
    return res.status(401).json({ error: 'Token verify failed: ' + e.message })
  }

  const email = decodedToken.email
  if (email !== process.env.ADMIN_EMAIL && email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized user: ' + email })
  }

  const db = getFirestore()

  // 3) GET di cortesia
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Endpoint /api/admin/missions → usa POST con JSON { url, standard, gold, vip }',
    })
  }

  // 4) POST per aggiungere missione
  if (req.method === 'POST') {
    const { url, standard, gold, vip } = req.body
    if (!url || standard == null || gold == null || vip == null) {
      return res.status(400).json({ error: 'Missing fields: url, standard, gold, vip' })
    }

    try {
      await db.collection('missions').add({
        url,
        rewards: { standard, gold, vip },
        createdAt: FieldValue.serverTimestamp(),
      })
      return res.status(200).json({ ok: true })
    } catch (e: any) {
      console.error('🔥 [missions] write error:', e)
      return res.status(500).json({ error: 'Write error: ' + e.message })
    }
  }

  // 5) Metodo non supportato
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

