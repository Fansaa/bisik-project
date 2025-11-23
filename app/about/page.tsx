"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowLeft, Heart, Lightbulb, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-2 md:p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/polos2-bg.jpg')" }}
    >
      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-black/5 p-6 md:p-8 lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative text-center mb-4">
            <Link
              href="/"
              className="absolute left-0 top-0 flex items-center gap-2 p-2 rounded-lg bg-black/5 hover:bg-black/10 text-black font-semibold text-xs md:text-sm border border-black/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-black text-center">Tentang BISIK</h1>
          </div>


          <div className="mt-6 space-y-4 text-black">
            <div className="flex items-center justify-between">
              {/* spacer retained for layout */}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="bg-white border border-black/10 rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-black mb-3">Apa itu BISIK?</h2>
                <p className="text-black/70 text-sm md:text-base leading-relaxed">
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
                  className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    <h3 className="font-semibold text-green-700 text-sm md:text-base">Ramah Anak</h3>
                  </div>
                  <p className="text-green-800/80 text-xs md:text-sm leading-relaxed">
                    Dirancang dengan pendekatan yang hangat, sabar, dan positif untuk anak-anak.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    <h3 className="font-semibold text-blue-700 text-sm md:text-base">Edukatif</h3>
                  </div>
                  <p className="text-blue-800/80 text-xs md:text-sm leading-relaxed">
                    Membantu anak-anak belajar dan memahami konsep baru dengan cara yang menyenangkan.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                    <h3 className="font-semibold text-amber-700 text-sm md:text-base">Inklusif</h3>
                  </div>
                  <p className="text-amber-800/80 text-xs md:text-sm leading-relaxed">
                    Dapat diakses oleh semua anak, termasuk mereka dengan kebutuhan khusus.
                  </p>
                </motion.div>
              </div>

              <div className="bg-white border border-black/10 rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-black mb-3">Fitur Utama</h2>
                <ul className="space-y-2 text-black/80 text-sm md:text-base">
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

              <div className="bg-white border border-black/10 rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-black mb-3">Teknologi</h2>
                <p className="text-black/70 text-sm md:text-base leading-relaxed mb-3">
                  BISIK menggunakan Google Gemini AI, model kecerdasan buatan terdepan yang mampu memahami dan
                  menganalisis gambar dengan akurasi tinggi. Teknologi ini memungkinkan BISIK memberikan penjelasan yang
                  akurat, relevan, dan disesuaikan untuk anak-anak.
                </p>
              </div>

              <div className="bg-white border border-black/10 rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-black mb-3">Misi Kami</h2>
                <p className="text-black/70 text-sm md:text-base leading-relaxed">
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
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-sm md:text-base shadow-md"
                >
                  Mulai Menggunakan BISIK
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* Footer Sponsor */}
      <footer className="mt-12 py-8 border-t border-black/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-lg md:text-xl font-semibold text-black mb-6">
            Didukung dan dikembangkan oleh
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center items-center">
            {/* Semua logo menggunakan ukuran yang sama dengan /fte.png */}
            <img src="/telkom-indonesia.png" alt="Telkom Indonesia" className="h-25 w-auto max-w-[100px] md:max-w-[120px] object-contain" />
            <img src="/ayoberaksi.png" alt="AyoBerAKSI" className="h-17 w-auto max-w-[100px] md:max-w-[200px] object-contain" />
            <img src="/danantara.png" alt="Danantara" className="h-36 w-auto max-w-[1000px] md:max-w-[1200px] object-contain" />
            <img src="/bisa.png" alt="BISA" className="h-14 w-auto max-w-[100px] md:max-w-[120px] object-contain" />
            
            <img src="/telkom-university.png" alt="Telkom University" className="h-15 w-auto max-w-[1000px] md:max-w-[1200px] object-contain" />
            <img src="/fte.png" alt="FTE" className="h-12 w-auto max-w-[10000px] md:max-w-[1100px] object-contain" />
            <img src="/fif.png" alt="FIF" className="h-14 w-auto max-w-[10000px] md:max-w-[1500px] object-contain" />
            <img src="/fri.png" alt="FRI" className="h-14 w-auto max-w-[10000px] md:max-w-[1500px] object-contain" />



          </div>
        </div>
      </footer>

    </main>
  )
}