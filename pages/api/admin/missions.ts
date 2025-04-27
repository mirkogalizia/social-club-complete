// pages/api/admin/missions.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('👉 Ricevuta richiesta su /api/admin/missions')

  if (req.method === 'POST') {
    try {
      const { url, rewards } = req.body

      if (!url || !rewards) {
        console.error('❌ Mancano dati nella richiesta POST')
        return res.status(400).json({ error: 'Missing url or rewards' })
      }

      await db.collection('missions').add({
        url,
        rewards,
        createdAt: Timestamp.now(),
      })

      console.log('✅ Missione aggiunta correttamente')
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('🚨 Errore durante creazione missione:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  } 
  else if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('missions').get()
      const missions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      console.log('✅ Missioni caricate:', missions.length)
      return res.status(200).json(missions)
    } catch (error) {
      console.error('🚨 Errore durante caricamento missioni:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

