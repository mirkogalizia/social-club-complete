// pages/api/admin/missions.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { url, rewards } = req.body;

      if (!url || !rewards) {
        return res.status(400).json({ error: 'Missing url or rewards' });
      }

      await db.collection('missions').add({
        url,
        rewards,
        createdAt: Timestamp.now(), // Usiamo Timestamp di firebase-admin
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Mission creation error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

