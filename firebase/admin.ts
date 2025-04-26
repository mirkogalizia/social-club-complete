// firebase/admin.ts
import admin from 'firebase-admin'

if (!admin.apps.length) {
  // Leggi le variabili d’ambiente
  const projectId    = process.env.FIREBASE_PROJECT_ID
  const clientEmail  = process.env.FIREBASE_CLIENT_EMAIL
  const rawKey       = process.env.FIREBASE_PRIVATE_KEY

  // Controlla che siano tutte presenti
  if (!projectId || !clientEmail || !rawKey) {
    throw new Error(
      'Firebase Admin SDK initialization error: missing ' +
      [
        !projectId   ? 'FIREBASE_PROJECT_ID'   : null,
        !clientEmail ? 'FIREBASE_CLIENT_EMAIL' : null,
        !rawKey      ? 'FIREBASE_PRIVATE_KEY'  : null,
      ].filter(Boolean).join(', ')
    )
  }

  // Il privateKey deve avere veri newline, non '\n' letterali
  const privateKey = rawKey.includes('\\n')
    ? rawKey.replace(/\\n/g, '\n')
    : rawKey

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  })
}

export const db        = admin.firestore()
export const authAdmin = admin.auth()
