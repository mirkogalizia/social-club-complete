// firebase/types.ts
import { Timestamp, DocumentReference } from 'firebase-admin/firestore'

/** Profilo utente */
export interface UserProfile {
  firstName: string
  lastName:  string
  phone:     string
  plan:      'standard' | 'gold' | 'vip'
  credits:   number
  createdAt: Timestamp
}

/** Documento di missione globale */
export interface Mission {
  url:       string
  rewards:   {
    standard: number
    gold:     number
    vip:      number
  }
  createdAt: Timestamp
}

/** Missione assegnata a un utente */
export interface UserMission {
  missionRef:  DocumentReference<Mission>
  status:      'pending' | 'completed'
  assignedAt:  Timestamp
  completedAt?: Timestamp
}
