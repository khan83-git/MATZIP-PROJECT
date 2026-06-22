import { useState, useRef, useCallback } from 'react'
import { streamCuration } from '@/api/curation'
import type { CurationResult, MoodType, Restaurant } from '@/types'

interface UseCurationReturn {
  isLoading: boolean
  streamText: string
  results: CurationResult[]
  overallComment: string
  error: string | null
  startCuration: (
    restaurants: Restaurant[],
    moodType: MoodType
  ) => Promise<void>
  reset: () => void
}

export function useCuration(): UseCurationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [results, setResults] = useState<CurationResult[]>([])
  const [overallComment, setOverallComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
    setStreamText('')
    setResults([])
    setOverallComment('')
    setError(null)
  }, [])

  const startCuration = useCallback(
    async (restaurants: Restaurant[], moodType: MoodType) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setIsLoading(true)
      setStreamText('')
      setResults([])
      setOverallComment('')
      setError(null)

      try {
        const finalResult = await streamCuration(
          restaurants,
          moodType,
          text => setStreamText(text),
          controller.signal
        )
        setResults(finalResult.recommendations ?? [])
        setOverallComment(finalResult.overallComment ?? '')
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError('AI 추천 생성에 실패했습니다. 다시 시도해주세요.')
      } finally {
        setIsLoading(false)
        setStreamText('')
      }
    },
    []
  )

  return {
    isLoading,
    streamText,
    results,
    overallComment,
    error,
    startCuration,
    reset,
  }
}
