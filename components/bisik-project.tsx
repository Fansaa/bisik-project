"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, Upload, Type, Send, Volume2, Square, RotateCcw, Loader, ArrowLeft } from "lucide-react"
import NextLink from "next/link"
import { motion } from "motion/react"

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error("[v0] GEMINI_API_KEY tidak dikonfigurasi")
}

type Screen = "start" | "options" | "home" | "camera" | "upload" | "text" | "voice"

export default function BisikProject({ initialScreen = "start" as Screen }: { initialScreen?: Screen }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreen)
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [output, setOutput] = useState("Hasil akan muncul di sini...")
  const [isLoading, setIsLoading] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [textInput, setTextInput] = useState("")
  const [lastResponseText, setLastResponseText] = useState("")
  const [cameraError, setCameraError] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)



  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      cleanupAudio()
    }
  }, [])

  const showError = (msg: string) => {
    setErrorMessage(msg)
    setTimeout(() => setErrorMessage(null), 4000)
  }

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }

  const buildPrompt =
    () => `Kamu adalah sistem pendeteksi objek yang akan membantu anak-anak berkebutuhan khusus memahami dunia di sekitarnya.
Analisis gambar ini dan berikan hasil dengan cara yang mudah dimengerti.

Gunakan format seperti ini:
1. Nama objek utama: (sebut nama objek yang paling jelas terlihat)
2. Penjelasan sederhana:
   - Gunakan kalimat seperti: "Aku adalah ... Aku berfungsi untuk ..."
   - Bisa tambahkan: "Aku biasanya terletak di ..." atau "Aku digunakan ketika ..."
   - Hindari istilah teknis, gunakan kata yang lembut dan sederhana.

Format dan angkanya tidak perlu dituliskan, hanya isi dari formatnya saja.
Contoh :
Kursi
Aku adalah kursi. Aku digunakan untuk duduk agar tubuh bisa beristirahat.
Aku biasanya berada di ruang tamu, ruang makan, atau kelas.

Tulis dengan gaya seolah kamu berbicara langsung dengan anak-anak, hangat, sabar, dan positif.
Jangan gunakan simbol, emoji, atau format lain selain teks biasa.`

  const openCamera = async () => {
    try {
      setCameraError("")
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      } 

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      setCurrentScreen("camera")

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((err) => {
              console.error("Error playing video:", err)
              setCameraError("Gagal memutar video kamera")
            })
          }
        }
      }, 100)
    } catch (error) {
      const errorMsg = (error as Error).message
      setCameraError(`Tidak bisa membuka kamera: ${errorMsg}`)
      showError("Kamera tidak bisa dibuka. Periksa izin kamera Anda.")
      setCurrentScreen("options")
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCapturedImage(null)
    setCameraError("")
    setCurrentScreen("options")
  }

  const goBackToOptions = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setCapturedImage(null)
    setUploadedImage(null)
    setGeneratedImage(null)
    setCameraError("")
    setTextInput("")
    setLastResponseText("")
    setOutput("Hasil akan muncul di sini...")
    setIsPlaying(false)
    setIsLoading(false)
    cleanupAudio()
    if (fileInputRef.current) fileInputRef.current.value = ""
    setCurrentScreen("options")
  }

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      showError("Browser Anda tidak mendukung input suara.")
      setOutput("Silakan gunakan metode lain.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "id-ID"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognitionRef.current = recognition

    recognition.onstart = () => {
      setIsRecording(true)
      setOutput("Silahkan bicara...")

      setTimeout(() => {
        if (isRecording) {
          stopSpeechRecognition()
          showError("Waktu maksimal suara 10 detik")
        }
      }, 10000)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setTextInput(transcript)
      setOutput(`Mendengar: "${transcript}". Mencari gambar...`)
      handleVoiceFlow(transcript)
    }

    recognition.onerror = () => {
      showError("Gagal mengenali suara. Coba bicara lebih jelas.")
    }

    recognition.onend = () => {
      setIsRecording(false)

      if (!textInput.trim()) {
        showError("Tidak terdeteksi suara. Coba lagi ya!")
      }
    }

    recognition.start()
  }

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
    setOutput("Berhenti mendengarkan...")
  }

  const handleVoiceFlow = async (desc: string) => {
    setIsLoading(true)

    try {
      const generateResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: desc }),
      })

      const imageData = await generateResponse.json()

      if (!imageData.success || !imageData.imageUrl) {
        showError("❌ Tidak dapat menemukan gambar yang sesuai suara.")
        setIsLoading(false)
        return
      }

      setGeneratedImage(imageData.imageUrl)
      setOutput("Gambar ditemukan! Menganalisis...")


      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = async () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const base64 = canvas.toDataURL("image/png").split(",")[1]

        await sendToGemini(base64)
        setIsLoading(false)
      }
      img.src = imageData.imageUrl

    } catch {
      showError("❌ Suara tidak bisa diproses")
      setIsLoading(false)
    }
  }


  const handleVoiceGenerate = async () => {
    const desc = textInput.trim()
    if (!desc) {
      setOutput("Silahkan ucapkan sesuatu terlebih dahulu.")
      return
    }

    setIsLoading(true)
    setOutput("Menghasilkan gambar dari suara...")

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: desc }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        showError("Gambar tidak dapat dihasilkan dari suara.")
        setIsLoading(false)
        return
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        setOutput("Gambar berhasil dihasilkan ✅ Klik Analisis untuk melihat penjelasan")

        // Belum analisis sampai user klik tombol analisis
      }
    } catch (error) {
      setOutput("❌ Terjadi kesalahan saat generate gambar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceAnalyze = async () => {
    if (!generatedImage) return

    setIsLoading(true)
    setOutput("Menganalisis gambar...")

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = async () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      const base64 = canvas.toDataURL("image/png").split(",")[1]

      try {
        await sendToGemini(base64)
      } finally {
        setIsLoading(false)
      }
    }
    img.src = generatedImage
  }



  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx && videoRef.current.videoWidth > 0) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/png")
        setCapturedImage(imageData)
        setOutput("Gambar berhasil diambil. Klik 'Kirim' untuk menganalisis.")
      } else {
        setOutput("Video belum siap. Tunggu sebentar dan coba lagi.")
      }
    }
  }

  const sendToGemini = async (base64: string) => {
    setIsLoading(true)
    setOutput("Menganalisis gambar...")
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: buildPrompt() },
                  {
                    inlineData: {
                      mimeType: "image/png",
                      data: base64,
                    },
                  },
                ],
              },
            ],
          }),
        },
      )

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal menganalisis gambar"
      setOutput(text)
      setLastResponseText(text)
    } catch (error) {
      setOutput("Gagal menganalisis gambar: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCameraSend = () => {
    if (!capturedImage) {
      setOutput("Ambil gambar dulu.")
      return
    }
    const base64 = capturedImage.split(",")[1]
    sendToGemini(base64)
  }

  const handleUploadSend = () => {
    if (!uploadedImage) {
      setOutput("Pilih gambar dulu.")
      return
    }
    const base64 = uploadedImage.split(",")[1]
    sendToGemini(base64)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError("Ukuran gambar terlalu besar (maksimal 5 MB)")
        if (fileInputRef.current) fileInputRef.current.value = ""
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setOutput("Gambar berhasil diunggah!")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateText = async () => {
    const desc = textInput.trim()
    if (!desc) {
      setOutput("Masukkan deskripsi terlebih dahulu.")
      return
    }
    setIsLoading(true)
    setOutput("Mencari gambar...")

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: desc }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setOutput("❌ Gambar tidak bisa digenerate")
        setIsLoading(false)
        return
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        setOutput("Menganalisis gambar...")

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = async () => {
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0)
            const base64 = canvas.toDataURL("image/png").split(",")[1]

            try {
              const analysisResponse = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
                GEMINI_API_KEY,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    contents: [
                      {
                        parts: [
                          { text: buildPrompt() },
                          {
                            inlineData: {
                              mimeType: "image/png",
                              data: base64,
                            },
                          },
                        ],
                      },
                    ],
                  }),
                },
              )

              const analysisData = await analysisResponse.json()
              const analysisText =
                analysisData.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal menganalisis gambar"
              setOutput(analysisText)
              setLastResponseText(analysisText)
            } catch (error) {
              setOutput("Gagal menganalisis gambar: " + (error as Error).message)
            } finally {
              setIsLoading(false)
            }
          }
        }
        img.onerror = () => {
          setOutput("Gagal memproses gambar untuk analisis")
          setIsLoading(false)
        }
        img.src = data.imageUrl
      } else {
        setOutput("❌ Gambar tidak bisa digenerate")
        setIsLoading(false)
      }
    } catch (error) {
      setOutput("❌ Gambar tidak bisa digenerate")
      setIsLoading(false)
    }
  }

  const speak = async () => {
    if (!lastResponseText) return

    // Stop audio yang sedang berjalan jika ada
    if (audioRef.current) {
      stop()
    }

    setIsPlaying(true)

    try {
      const response = await fetch("http://192.168.18.7:5000/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: lastResponseText,
          language: "id",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      audioUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setIsPlaying(false)
        cleanupAudio()
      }

      audio.onerror = (error) => {
        console.error("Audio playback error:", error)
        setIsPlaying(false)
        cleanupAudio()
      }

      await audio.play()
    } catch (error) {
      console.error("TTS Error:", error)
      setIsPlaying(false)
      setOutput("❌ Gagal memutar audio. Pastikan TTS server berjalan di http://localhost:5000")
      cleanupAudio()
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    cleanupAudio()
  }

  const reset = () => {
    stop()
    setCapturedImage(null)
    setUploadedImage(null)
    setGeneratedImage(null)
    setOutput("Hasil akan muncul di sini...")
    setTextInput("")
    fileInputRef.current && (fileInputRef.current.value = "")
    setLastResponseText("")
    setCurrentScreen("options")
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  return (
    <div className="w-full flex flex-col gap-3 md:gap-4">
      <div className="text-center relative">
        <h2 className="text-3xl md:text-4xl font-bold text-black">BISIK</h2>
        <div className="absolute right-0 top-1">
          <NextLink href="/" className="text-xs md:text-sm text-black/60 hover:text-black underline">
            Ke Halaman Utama
          </NextLink>
        </div>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 p-2 rounded-lg bg-red-500/20 border border-red-400/40 text-red-300 text-xs md:text-sm text-center"
          >
            ⚠️ {errorMessage}
          </motion.div>
        )}

      </div>

      <div className="w-full">
        {currentScreen === "options" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 md:space-y-4">
            <motion.button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-black/5 hover:bg-black/10 text-black font-semibold text-xs md:text-sm border border-black/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </motion.button>
            <p className="text-center text-black/70 text-xs md:text-sm mb-3 md:mb-4">
              Pilih metode input yang ingin Anda gunakan
            </p>

            <motion.div
              onClick={openCamera}
              className="p-3 md:p-4 rounded-xl bg-green-50 border border-green-200 hover:shadow-sm cursor-pointer transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-green-900 font-semibold text-sm md:text-base">Gunakan Kamera</h3>
                  <p className="text-green-900/80 text-xs md:text-sm mt-1">
                    Arahkan kamera ke objek yang ingin dianalisis untuk mendapatkan penjelasan secara real-time.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              onClick={() => {
                setCurrentScreen("upload")
                setTimeout(() => fileInputRef.current?.click(), 0)
              }}
              className="p-3 md:p-4 rounded-xl bg-blue-50 border border-blue-200 hover:shadow-sm cursor-pointer transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <Upload className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-1" /> 
                <div className="flex-1">
                  <h3 className="text-blue-900 font-semibold text-sm md:text-base">Unggah Gambar</h3>
                  <p className="text-blue-900/80 text-xs md:text-sm mt-1">
                    Pilih gambar dari perangkat Anda untuk dianalisis dan dijelaskan dengan detail.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              onClick={() => setCurrentScreen("text")}
              className="p-3 md:p-4 rounded-xl bg-amber-50 border border-amber-200 hover:shadow-sm cursor-pointer transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <Type className="w-5 h-5 md:w-6 md:h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-amber-900 font-semibold text-sm md:text-base">Masukkan Teks</h3>
                  <p className="text-amber-900/80 text-xs md:text-sm mt-1">
                    Deskripsikan objek atau adegan yang ingin Anda lihat, dan kami akan menghasilkan gambar untuk Anda.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              onClick={() => setCurrentScreen("voice")}
              className="p-3 md:p-4 rounded-xl bg-purple-50 border border-purple-200 hover:shadow-sm cursor-pointer transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-purple-900 font-semibold text-sm md:text-base">Gunakan Suara</h3>
                  <p className="text-purple-900/80 text-xs md:text-sm mt-1">
                    Ucapkan deskripsi objek untuk menghasilkan gambar dan penjelasannya.
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>


        )}

        {currentScreen === "voice" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">

            <motion.button onClick={goBackToOptions}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-black/5 hover:bg-black/10 text-black font-semibold text-xs md:text-sm border border-black/10">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </motion.button>

            <div className="text-xs md:text-sm text-black/70 bg-black/5 p-2 rounded-lg border border-black/10">
              Klik “Mulai Merekam”, ucapkan deskripsi objek.
            </div>

            <motion.button
              onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border ${isRecording ? "bg-red-100 border-red-200 text-red-900" : "bg-purple-100 border-purple-200 text-purple-900"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Volume2 className="w-5 h-5" />
              {isRecording ? "Berhenti Merekam" : "Mulai Merekam"}
            </motion.button>

            {/* ✅ Waveform indikator masuk di sini */}
            {isRecording && (
              <div className="w-full flex justify-center mt-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-6 bg-purple-300 rounded-md"
                      animate={{ scaleY: [0.3, 1.2, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* ✅ Tampilkan hasil suara yang diucapkan user */}
            {textInput && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/5 border border-black/10 p-3 rounded-lg text-black/80 text-xs md:text-sm"
              >
                🎙️ Hasil suara: <strong>{textInput}</strong>
              </motion.div>
            )}



            {generatedImage && (
              <motion.img
                src={generatedImage}
                className="w-full rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}

            {(output || isLoading) && (
              <motion.div className="p-3 rounded-lg bg-black/5 border border-black/10 min-h-16">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-black/70">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs md:text-sm">{output}</span>
                  </div>
                ) : (
                  <p className="text-black/80 text-xs md:text-sm whitespace-pre-wrap">{output}</p>
                )}
              </motion.div>
            )}

          </motion.div>
        )}

        {currentScreen === "camera" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 md:space-y-3">
            <motion.button
              onClick={goBackToOptions}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-black/5 hover:bg-black/10 text-black font-semibold text-xs md:text-sm border border-black/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </motion.button>
            <div className="text-xs md:text-sm text-black/70 bg-black/5 p-2 rounded-lg border border-black/10">
              Arahkan kamera ke objek yang ingin dianalisis, kemudian klik "Ambil Gambar"
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black/40 w-full">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto object-cover" />
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <p className="text-red-300 text-center px-4 text-xs md:text-sm">{cameraError}</p>
                </div>
              )}
            </div>
            {capturedImage && (
              <motion.img
                src={capturedImage}
                alt="Preview"
                className="w-full h-auto object-contain rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}
            <div className="flex gap-2">
              <motion.button
                onClick={capturePhoto}
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs md:text-sm border border-amber-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="w-4 h-4" />
                Ambil Gambar
              </motion.button>
              <motion.button
                onClick={closeCamera}
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-semibold text-xs md:text-sm border border-red-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Square className="w-4 h-4" />
                Tutup
              </motion.button>
            </div>
            {capturedImage && (
              <motion.button
                onClick={handleCameraSend}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold text-xs md:text-sm disabled:opacity-50 border border-blue-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-4 h-4" />
                {isLoading ? "Menganalisis..." : "Kirim"}
              </motion.button>
            )}

            {(capturedImage || isLoading || lastResponseText) && (
              <motion.div
                className="mt-3 md:mt-4 p-2 md:p-3 rounded-lg bg-black/5 border border-black/10 min-h-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 text-black/70">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs md:text-sm">{output}</span>
                  </div>
                ) : (
                  <p className="text-black/80 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {currentScreen === "upload" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 md:space-y-3">
            <motion.button
              onClick={goBackToOptions}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-black/5 hover:bg-black/10 text-black font-semibold text-xs md:text-sm border border-black/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </motion.button>
            <div className="text-xs md:text-sm text-black/70 bg-black/5 p-2 rounded-lg border border-black/10">
              Pilih gambar dari perangkat Anda untuk dianalisis (Maksimal 5 MB)
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl border-2 border-dashed border-black/20 hover:border-black/30 text-black/60 hover:text-black transition-colors text-xs md:text-sm"
              whileHover={{ scale: 1.02 }}
            >
              Klik untuk memilih gambar
            </motion.button>
            {uploadedImage && (
              <motion.img
                src={uploadedImage}
                alt="Preview Upload"
                className="w-full h-auto object-contain rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}
            {uploadedImage && (
              <motion.button
                onClick={handleUploadSend}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold text-xs md:text-sm disabled:opacity-50 border border-blue-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-4 h-4" />
                {isLoading ? "Menganalisis..." : "Kirim"}
              </motion.button>
            )}

            {(uploadedImage || isLoading || lastResponseText) && (
              <motion.div
                className="mt-3 md:mt-4 p-2 md:p-3 rounded-lg bg-black/5 border border-black/10 min-h-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 text-black/70">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs md:text-sm">{output}</span>
                  </div>
                ) : (
                  <p className="text-black/80 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {currentScreen === "text" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 md:space-y-3">
            <motion.button
              onClick={goBackToOptions}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-black/5 hover:bg-black/10 text-black font-semibold text-xs md:text-sm border border-black/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </motion.button>
            <div className="text-xs md:text-sm text-black/70 bg-black/5 p-2 rounded-lg border border-black/10">
              Deskripsikan objek atau adegan yang ingin Anda lihat (Maksimal 50 Karakter). Contoh: "Kucing berwarna putih"
            </div>
            <input
              type="text"
              value={textInput}
              onChange={(e) => {
                const v = e.target.value
                if (v.length > 50) {
                  showError("Maksimal 50 karakter")
                  return
                }
                setTextInput(v)
              }}
              placeholder="Isi deskripsi pada box ini"
              className="w-full p-2 rounded-lg bg-black/5 border border-black/10 text-black placeholder-black/50 focus:outline-none focus:border-blue-400 text-xs md:text-sm"
            />
            {generatedImage && (
              <motion.img
                src={generatedImage}
                alt="Generated Image"
                className="w-full h-auto object-contain rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}
            <motion.button
              onClick={handleGenerateText}
              disabled={isLoading || !textInput.trim()}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold text-xs md:text-sm disabled:opacity-50 border border-blue-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Type className="w-4 h-4" />
              {isLoading ? "Menghasilkan..." : "Generate Gambar"}
            </motion.button>

            {(generatedImage || isLoading || lastResponseText) && (
              <motion.div
                className="mt-3 md:mt-4 p-2 md:p-3 rounded-lg bg-black/5 border border-black/10 min-h-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 text-black/70">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs md:text-sm">{output}</span>
                  </div>
                ) : (
                  <p className="text-black/80 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {(lastResponseText || isPlaying) && (
        <div className="flex gap-2 pt-2">
          <motion.button
            onClick={speak}
            disabled={!lastResponseText || isPlaying}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-900 font-semibold text-xs md:text-sm disabled:opacity-50 border border-green-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Bacakan hasil"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Bacakan</span>
          </motion.button>
          <motion.button
            onClick={stop}
            disabled={!isPlaying}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs md:text-sm disabled:opacity-50 border border-amber-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Hentikan pemutaran"
          >
            <Square className="w-4 h-4" />
            <span className="hidden sm:inline">Hentikan</span>
          </motion.button>
          <motion.button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-semibold text-xs md:text-sm border border-red-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Reset aplikasi"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </motion.button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}