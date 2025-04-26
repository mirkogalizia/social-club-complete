import app from './config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth(app)
