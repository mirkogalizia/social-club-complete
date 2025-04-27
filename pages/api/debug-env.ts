// pages/api/debug-env.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../firebase/admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const testDoc = await db.collection('test').doc('testDoc').get()

    if (!testDoc.exists) {
      return res.status(200).json({ message: 'Connected to Firestore, but document does not exist.' })
    } else {
      return res.status(200).json({ message: 'Connected to Firestore!', data: testDoc.data() })
    }
  } catch (error) {
    console.error('Firestore connection error:', error)
    return res.status(500).json({ error: 'Failed to connect to Firestore', details: (error as any).message })
  }
}
