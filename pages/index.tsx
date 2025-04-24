import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Social Club</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white p-8 rounded-2xl border border-gray-700 shadow-xl backdrop-blur bg-gray-800/40 max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">Benvenuto su Social Club</h1>
          <p className="text-lg mb-6 text-gray-300">Accedi o registrati per iniziare</p>
          <div className="flex flex-col gap-4">
            <Link href="/login" className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
              Accedi
            </Link>
            <Link href="/signup" className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">
              Registrati
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
