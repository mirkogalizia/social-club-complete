// pages/api/debug-env.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKeyStatus: process.env.FIREBASE_PRIVATE_KEY ? 'OK' : 'MISSING',
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  })
}
