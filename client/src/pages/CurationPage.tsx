import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/store/searchStore'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import EmptyState from '@/components/common/EmptyState'
import { MOOD_OPTIONS } from '@/components/common/MoodChip'
import type { MoodType, CurationResult } from '@/types'

const RANK_BADGE: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}

interface CurationCardProps {
  result: CurationResult
  restaurantName: string
}

function CurationCard({ result, restaurantName }: CurationCardProps) {
  return (
    <div className="space-y-2.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">
            {RANK_BADGE[result.rank] ?? `#${result.rank}`}
          </span>
          <div>
            <p className="text-sm font-bold text-gray-900">{restaurantName}</p>
            <p className="text-xs font-medium text-orange-500">
              {result.summary}
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-gray-600">{result.comment}</p>
      <div className="flex flex-wrap gap-1.5">
        {result.tags.map(tag => (
          <Badge key={tag} variant="orange">
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default function CurationPage() {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    useSearchStore.getState().selectedMood
  )
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<CurationResult[]>([])
  const [overallComment, setOverallComment] = useState('')
  const [streamText, setStreamText] = useState('')

  const restaurants = useSearchStore(s => s.restaurants)

  const handleCurate = async () => {
    if (!selectedMood || restaurants.length === 0) return

    setIsLoading(true)
    setResults([])
    setOverallComment('')
    setStreamText('')

    try {
      const response = await fetch('/api/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurants, moodType: selectedMood }),
      })

      if (!response.body) throw new Error('스트림 없음')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data) as { text: string }
            accumulated += parsed.text
            setStreamText(accumulated)
          } catch {
            /* 불완전 청크 무시 */
          }
        }
      }

      // JSON 파싱
      const jsonMatch = accumulated.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setResults(parsed.recommendations ?? [])
        setOverallComment(parsed.overallComment ?? '')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
      setStreamText('')
    }
  }

  const hasRestaurants = restaurants.length > 0

  return (
    <div className="flex h-[calc(100svh-60px)] flex-col">
      <Header title="AI 맛집 추천" showBack />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* 모임 성격 선택 */}
        <div className="bg-white px-5 py-5">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            어떤 모임인가요?
          </p>
          <div className="grid grid-cols-5 gap-2">
            {MOOD_OPTIONS.map(opt => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setSelectedMood(opt.type)}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                  selectedMood === opt.type
                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                    : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[11px]">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 맛집 없음 안내 */}
        {!hasRestaurants && (
          <EmptyState
            icon="🔍"
            title="먼저 맛집을 검색해주세요"
            description="검색 화면에서 주변 맛집을 찾은 후 AI 추천을 받아보세요"
            actionLabel="검색하러 가기"
            onAction={() => navigate('/search')}
          />
        )}

        {/* 추천 결과 */}
        {results.length > 0 && (
          <div className="space-y-3 px-4 py-4">
            {/* 전체 코멘트 배너 */}
            {overallComment && (
              <div className="flex items-start gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                <Sparkles
                  size={16}
                  className="mt-0.5 shrink-0 text-orange-400"
                />
                <p className="text-xs leading-relaxed text-orange-700">
                  {overallComment}
                </p>
              </div>
            )}
            {results.map(result => {
              const r = restaurants.find(x => x.id === result.restaurantId)
              return r ? (
                <CurationCard
                  key={result.restaurantId}
                  result={result}
                  restaurantName={r.name}
                />
              ) : null
            })}
          </div>
        )}

        {/* 스트리밍 중 텍스트 */}
        {isLoading && streamText && (
          <div className="mx-4 mt-4 rounded-2xl border border-orange-100 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={14} className="animate-pulse text-orange-400" />
              <span className="text-xs font-medium text-orange-500">
                AI가 분석 중이에요...
              </span>
            </div>
            <p className="text-xs leading-relaxed whitespace-pre-wrap text-gray-500">
              {streamText}
            </p>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      {hasRestaurants && (
        <div className="border-t border-gray-100 bg-white px-5 py-4">
          <Button
            fullWidth
            isLoading={isLoading}
            disabled={!selectedMood}
            onClick={
              results.length > 0
                ? () => {
                    setResults([])
                    handleCurate()
                  }
                : handleCurate
            }
            className="gap-2"
          >
            {results.length > 0 ? (
              <>
                <RefreshCw size={15} />
                다시 추천받기
              </>
            ) : (
              <>
                <Sparkles size={15} />
                AI 추천 받기
              </>
            )}
          </Button>
          {!selectedMood && (
            <p className="mt-2 text-center text-xs text-gray-400">
              모임 성격을 먼저 선택해주세요
            </p>
          )}
        </div>
      )}
    </div>
  )
}
