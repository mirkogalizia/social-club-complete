import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, rewards } = req.body;

  if (!url || !rewards) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.collection('missions').add({
      url,
      rewards,
      createdAt: FieldValue.serverTimestamp(),  // <-- CORRETTO COSÌ
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Errore API /missions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

