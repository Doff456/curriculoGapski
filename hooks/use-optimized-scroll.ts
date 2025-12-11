"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useOptimizedScroll() {
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number>()
  const lastScrollY = useRef(0)
  const isScrolling = useRef(false)

  const handleScroll = useCallback(() => {
    if (isScrolling.current) return

    isScrolling.current = true

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      // Só atualiza se a diferença for significativa (reduz re-renders)
      if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
        setScrollY(currentScrollY)
        lastScrollY.current = currentScrollY
      }
      isScrolling.current = false
    })
  }, [])

  useEffect(() => {
    // Throttle mais agressivo para melhor performance
    let timeoutId: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 16) // ~60fps
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", throttledScroll)
      clearTimeout(timeoutId)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  return scrollY
}
