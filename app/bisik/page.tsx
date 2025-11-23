"use client"

import BisikProject from "@/components/bisik-project"

export default function BisikPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-2 md:p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/polos2-bg.jpg')" }}
    >
      <div className="relative z-10 w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl border border-black/5 p-3 md:p-5">
          <BisikProject initialScreen="options" />
        </div>
      </div>
    </main>
  )
}


