import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import app from '../firebase/config'

const Dashboard = () => {
  const router = useRouter()
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/login')
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = () => {
    signOut(auth)
    router.push('/login')
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Benvenuto nella tua dashboard 🔐</h1>
      <p>Hai effettuato il login con successo.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
