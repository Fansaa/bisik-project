"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "motion/react"
import BisikProject from "./bisik-project"

export default function MusicPlayerUI() {
  const modalRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!modalRef.current || isMobile) return
      const rect = modalRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMousePos({ x, y })

      const filter = document.querySelector("#glass-distortion feDisplacementMap")
      if (filter) {
        const scaleX = (x / rect.width) * 100
        const scaleY = (y / rect.height) * 100
        filter.setAttribute("scale", String(Math.min(scaleX, scaleY) + 20))
      }
    }

    const handleMouseLeave = () => {
      const filter = document.querySelector("#glass-distortion feDisplacementMap")
      if (filter) {
        filter.setAttribute("scale", "77")
      }
    }

    const modal = modalRef.current
    if (modal && !isMobile) {
      modal.addEventListener("mousemove", handleMouseMove)
      modal.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        modal.removeEventListener("mousemove", handleMouseMove)
        modal.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isMobile])

  return (
    <>
      <svg style={{ display: "none" }}>
        <filter id="glass-distortion">
          <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <motion.div
        ref={modalRef}
        className="glass-card relative w-full max-w-2xl md:max-w-2xl lg:max-w-2xl rounded-3xl shadow-2xl flex flex-col mx-auto"
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
        <div
          className="glass-specular"
          style={{
            background: `radial-gradient(
              circle at ${mousePos.x}px ${mousePos.y}px,
              rgba(255,255,255,0.15) 0%,
              rgba(255,255,255,0.05) 30%,
              rgba(255,255,255,0) 60%
            )`,
          }}
        />

        <div className="glass-content relative z-[4] p-6 md:p-8 lg:p-12 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-[85vh]">
          <BisikProject />
        </div>
      </motion.div>
    </>
  )
}
