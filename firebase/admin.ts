// firebase/admin.ts

import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
}

const firebaseAdminApp = !getApps().length
  ? initializeApp(firebaseAdminConfig)
  : getApp()

const db = getFirestore(firebaseAdminApp)

export { firebaseAdminApp, db }
