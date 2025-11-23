"use client"

import { useEffect, useMemo, useState } from "react"

export default function FontSizeSlider() {
  const [value, setValue] = useState<number>(100)

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fontScalePercent")
      if (saved) {
        const pct = Number(saved)
        if (!Number.isNaN(pct) && pct >= 80 && pct <= 140) {
          setValue(pct)
          document.documentElement.style.fontSize = `${pct}%`
        }
      }
    } catch {}
  }, [])

  const onChange = (pct: number) => {
    setValue(pct)
    document.documentElement.style.fontSize = `${pct}%`
    try {
      localStorage.setItem("fontScalePercent", String(pct))
    } catch {}
  }

  const label = useMemo(() => `Ukuran Teks: ${value}%`, [value])

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      <div className="rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-black/10 px-3 py-2 flex items-center gap-3">
        <span className="text-xs text-black/70 whitespace-nowrap">{label}</span>
        <input
          aria-label="Font size"
          className="h-2 w-40 accent-blue-600"
          type="range"
          min={80}
          max={140}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}