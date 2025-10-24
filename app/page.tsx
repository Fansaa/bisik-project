import Link from "next/link"
import BisikModal from "@/components/bisik-modal"

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-2 md:p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/dream-bg.jpg')" }}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full flex flex-col items-center">
        <BisikModal />
        <Link
          href="/about"
          className="mt-6 md:mt-8 text-white/70 hover:text-white text-sm md:text-base font-medium transition-colors underline"
        >
          About Us
        </Link>
      </div>
    </main>
  )
}
