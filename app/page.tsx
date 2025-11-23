"use client"

import Link from "next/link"
import { motion } from "motion/react"

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-2 md:p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/polos2-bg.jpg')" }}
    >
      <div className="relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-black/5 p-6 md:p-8"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-center text-black">BISIK</h1>
          <p className="mt-3 text-center text-black/70 text-sm md:text-base">
            Selamat datang di BISIK! Aplikasi ini membantu anak-anak memahami dunia di sekitar mereka.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/bisik"
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-sm md:text-base shadow-md text-center"
            >
              Mulai
            </Link>
          </div>
        </motion.div>

        <section className="mt-8 w-full max-w-4xl">
          <div className="mt-4 text-center">
            <Link href="/about" className="text-black/60 hover:text-black underline text-sm md:text-base">Tentang Kami</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
