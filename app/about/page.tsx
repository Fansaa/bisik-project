"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowLeft, Heart, Lightbulb, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-2 md:p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/dream-bg.jpg')" }}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          className="glass-card relative rounded-3xl shadow-2xl flex flex-col"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.6,
          }}
        >
          <div className="glass-filter" />
          <div className="glass-distortion-overlay" />
          <div className="glass-overlay" />
          <div className="glass-specular" />

          <div className="glass-content relative z-[4] p-6 md:p-8 lg:p-12 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Tentang BISIK</h1>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm border border-white/20 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kembali</span>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="bg-white/8 border border-white/20 rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-3">Apa itu BISIK?</h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  BISIK adalah aplikasi inovatif yang dirancang khusus untuk membantu anak-anak berkebutuhan khusus
                  memahami dunia di sekitarnya. Dengan menggunakan teknologi kecerdasan buatan terkini, BISIK
                  menganalisis gambar dan memberikan penjelasan yang ramah, mudah dimengerti, dan disesuaikan dengan
                  cara berpikir anak-anak.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-green-300" />
                    <h3 className="font-semibold text-green-200 text-sm md:text-base">Ramah Anak</h3>
                  </div>
                  <p className="text-green-100/80 text-xs md:text-sm leading-relaxed">
                    Dirancang dengan pendekatan yang hangat, sabar, dan positif untuk anak-anak.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
                    <h3 className="font-semibold text-blue-200 text-sm md:text-base">Edukatif</h3>
                  </div>
                  <p className="text-blue-100/80 text-xs md:text-sm leading-relaxed">
                    Membantu anak-anak belajar dan memahami konsep baru dengan cara yang menyenangkan.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-amber-300" />
                    <h3 className="font-semibold text-amber-200 text-sm md:text-base">Inklusif</h3>
                  </div>
                  <p className="text-amber-100/80 text-xs md:text-sm leading-relaxed">
                    Dapat diakses oleh semua anak, termasuk mereka dengan kebutuhan khusus.
                  </p>
                </motion.div>
              </div>

              <div className="bg-white/8 border border-white/20 rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-3">Fitur Utama</h2>
                <ul className="space-y-2 text-white/80 text-sm md:text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold mt-1">•</span>
                    <span>
                      <strong>Analisis Gambar Kamera:</strong> Ambil foto dengan kamera perangkat dan dapatkan
                      penjelasan instan.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-1">•</span>
                    <span>
                      <strong>Unggah Gambar:</strong> Pilih gambar dari galeri perangkat untuk dianalisis.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold mt-1">•</span>
                    <span>
                      <strong>Generate Gambar:</strong> Buat gambar baru berdasarkan deskripsi teks yang ramah
                      anak-anak.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 font-bold mt-1">•</span>
                    <span>
                      <strong>Text-to-Speech:</strong> Dengarkan penjelasan dengan suara yang jelas dan mudah dipahami.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/8 border border-white/20 rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-3">Teknologi</h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-3">
                  BISIK menggunakan Google Gemini AI, model kecerdasan buatan terdepan yang mampu memahami dan
                  menganalisis gambar dengan akurasi tinggi. Teknologi ini memungkinkan BISIK memberikan penjelasan yang
                  akurat, relevan, dan disesuaikan untuk anak-anak.
                </p>
              </div>

              <div className="bg-white/8 border border-white/20 rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-3">Misi Kami</h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  Kami percaya bahwa setiap anak berhak mendapatkan akses ke teknologi yang dapat membantu mereka
                  belajar dan berkembang. BISIK hadir untuk membuat pembelajaran menjadi lebih mudah, menyenangkan, dan
                  inklusif bagi semua anak, khususnya mereka dengan kebutuhan khusus.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-4"
              >
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 font-semibold text-sm md:text-base border border-blue-400/30 hover:border-blue-400/50 transition-all"
                >
                  Mulai Menggunakan BISIK
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
