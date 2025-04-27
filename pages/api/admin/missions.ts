import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../firebase/db';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { url, rewards } = req.body;

      if (!url || !rewards) {
        return res.status(400).json({ error: 'Missing url or rewards' });
      }

      // Aggiungi la missione al database
      const docRef = await db.collection('missions').add({
        url,
        rewards,
        createdAt: Timestamp.now(), // Usiamo Timestamp di firebase-admin
      });

      return res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
      console.error('Mission creation error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      const missionSnap = await db.collection('missions').get();
      if (missionSnap.empty) {
        return res.status(404).json({ error: 'No missions found' });
      }

      const missions = missionSnap.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });

      return res.status(200).json(missions);
    } catch (error) {
      console.error('Error fetching missions:', error);
      return res.status(500).json({ error: 'Error fetching missions' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

