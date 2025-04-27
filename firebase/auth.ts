// firebase/auth.ts
import { getAuth } from "firebase/auth"
import { app } from "./firebase"     // ← punta a firebase/firebase.ts

export const auth = getAuth(app)
