// components/Navbar.tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center">
        <Link href="/">
          <a className="text-white font-semibold text-lg hover:text-yellow-400 transition">
            Home
          </a>
        </Link>
      </div>
    </nav>
  )
}
