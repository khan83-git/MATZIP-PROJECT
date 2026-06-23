import { useState, useEffect, useRef, useCallback } from 'react'

interface Options {
  onRefresh: () => void | Promise<void>
  threshold?: number
}

export function usePullToRefresh<T extends HTMLElement>(
  scrollRef: React.RefObject<T | null>,
  { onRefresh, threshold = 70 }: Options
) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const el = scrollRef.current
      if (!el || el.scrollTop > 0) return
      startY.current = e.touches[0].clientY
    },
    [scrollRef]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const el = scrollRef.current
      if (!el || el.scrollTop > 0) return
      const delta = e.touches[0].clientY - startY.current
      if (delta <= 0) return
      setIsPulling(true)
      setPullDistance(Math.min(delta * 0.4, threshold))
    },
    [scrollRef, threshold]
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    setIsPulling(false)
    setPullDistance(0)
  }, [isPulling, pullDistance, threshold, onRefresh])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd)
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, scrollRef])

  return { isPulling, pullDistance, isRefreshing }
}
