import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-white text-xl font-semibold">
          Social Club
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition">Pacchetti VIP</Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white transition">Leaderboard</Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}
