import { useState, useEffect, useCallback } from 'react'
import { ChevronUp } from 'lucide-react'

interface ScrollToTopFABProps {
  scrollRef: React.RefObject<HTMLElement | null>
}

export default function ScrollToTopFAB({ scrollRef }: ScrollToTopFABProps) {
  const [visible, setVisible] = useState(false)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setVisible(el.scrollTop > 200)
  }, [scrollRef])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll, scrollRef])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() =>
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }
      className="absolute right-4 bottom-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-200 transition-all active:scale-95"
      aria-label="맨 위로 이동"
    >
      <ChevronUp size={18} className="text-gray-600" />
    </button>
  )
}
