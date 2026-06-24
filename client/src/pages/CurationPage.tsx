import { useEffect } from 'react'
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/store/searchStore'
import { useCuration } from '@/hooks/useCuration'
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

  const restaurants = useSearchStore(s => s.restaurants)
  const selectedMood = useSearchStore(s => s.selectedMood)
  const setSelectedMood = useSearchStore(s => s.setSelectedMood)

  const {
    isLoading,
    streamText,
    results,
    overallComment,
    error,
    startCuration,
  } = useCuration()

  // 진입 시 조건이 갖춰지면 자동 실행 (마운트 1회만)
  useEffect(() => {
    if (
      restaurants.length > 0 &&
      selectedMood &&
      !isLoading &&
      results.length === 0
    ) {
      startCuration(restaurants, selectedMood)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMoodChange = (mood: MoodType) => {
    setSelectedMood(selectedMood === mood ? null : mood)
  }

  const handleCurate = () => {
    if (!selectedMood || restaurants.length === 0) return
    startCuration(restaurants, selectedMood)
  }

  const hasRestaurants = restaurants.length > 0
  const hasResults = results.length > 0
  // React 18 자동배칭으로 isLoading 중간상태가 렌더에 반영 안 될 수 있으므로
  // 첫 프레임부터 동기적으로 로딩 판단
  const shouldShowLoading =
    isLoading || (hasRestaurants && !!selectedMood && !hasResults && !error)

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
                onClick={() => handleMoodChange(opt.type)}
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

        {/* 에러 */}
        {error && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <AlertCircle size={15} className="shrink-0 text-red-400" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* 로딩 중 애니메이션 (결과 나오기 직전까지 유지) */}
        {shouldShowLoading && (
          <div className="flex flex-col items-center gap-6 px-4 py-10">
            <div className="flex items-end gap-4">
              <span className="animate-bounce text-4xl [animation-delay:0ms]">
                🍽️
              </span>
              <span className="animate-bounce text-4xl [animation-delay:150ms]">
                🤖
              </span>
              <span className="animate-bounce text-4xl [animation-delay:300ms]">
                ✨
              </span>
            </div>

            <>
              <div className="space-y-1 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  AI가 맛집을 분석중이에요
                </p>
                <p className="text-xs text-gray-400">
                  주변 식당들을 꼼꼼히 살펴보고 있어요
                </p>
              </div>
              <div className="flex gap-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:0ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:150ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />
              </div>
            </>
          </div>
        )}

        {/* 추천 결과 */}
        {hasResults && (
          <div className="space-y-3 px-4 py-4">
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
      </div>

      {/* 하단 고정 버튼 */}
      {hasRestaurants && (
        <div className="border-t border-gray-100 bg-white px-5 py-4">
          <Button
            fullWidth
            isLoading={shouldShowLoading}
            disabled={!selectedMood}
            onClick={handleCurate}
            className="gap-2"
          >
            {hasResults ? (
              <>
                <RefreshCw size={15} />
                다시 추천받기
              </>
            ) : shouldShowLoading ? (
              <>
                <Sparkles size={15} className="animate-spin" />
                AI가 분석중...
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
