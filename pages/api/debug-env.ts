// pages/api/debug-env.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    FIREBASE_PROJECT_ID:    process.env.FIREBASE_PROJECT_ID   || null,
    FIREBASE_CLIENT_EMAIL:  process.env.FIREBASE_CLIENT_EMAIL || null,
    FIREBASE_PRIVATE_KEY:   process.env.FIREBASE_PRIVATE_KEY  ? '[***FOUND***]' : null,
  })
}
