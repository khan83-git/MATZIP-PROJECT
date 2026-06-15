import { useState, useEffect, useRef } from 'react'
import { geocodeSearch } from '@/api/geocode'
import type { GeocodeResult } from '@/types'

export function useGeocodeSearch(query: string, delay = 350) {
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    timerRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data = await geocodeSearch(query)
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query, delay])

  return { results, isLoading }
}
