// pages/api/admin/missions.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase/admin';
import { serverTimestamp } from 'firebase-admin/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Se vuoi limitare l'accesso a un solo admin:
  // if (req.headers['x-admin-email'] !== process.env.ADMIN_EMAIL) {
  //   return res.status(403).json({ error: 'Forbidden' });
  // }

  if (req.method === 'GET') {
    try {
      const snap = await db
        .collection('missions')
        .orderBy('createdAt', 'desc')
        .get();
      const missions = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(missions);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const { url, rewards } = req.body;
    if (!url || !rewards) {
      return res.status(400).json({ error: 'Missing url or rewards' });
    }
    try {
      await db.collection('missions').add({
        url,
        rewards,
        createdAt: serverTimestamp(),
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

