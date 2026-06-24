import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Map,
  List,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { useLocationStore } from '@/store/locationStore'
import { useSearchStore } from '@/store/searchStore'
import { useFavoriteStore } from '@/store/favoriteStore'
import { useRestaurantSearch } from '@/hooks/useRestaurantSearch'
import Header from '@/components/layout/Header'
import LocationSearchInput from '@/components/common/LocationSearchInput'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import { RestaurantCardSkeleton } from '@/components/common/Skeleton'
import MapView from '@/components/map/MapView'
import ScrollToTopFAB from '@/components/common/ScrollToTopFAB'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
const CATEGORIES = ['전체', '한식', '중식', '일식', '양식', '카페', '기타']
const SORT_OPTIONS = [
  { label: '거리순', value: 'distance' as const },
  { label: '평점순', value: 'rating' as const },
  { label: '리뷰순', value: 'reviewCount' as const },
]

export default function SearchPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const centerCoords = useLocationStore(s => s.centerCoords)
  const centerLabel = useLocationStore(s => s.centerLabel)
  const radius = useLocationStore(s => s.radius)
  const setRadius = useLocationStore(s => s.setRadius)

  const selectedRestaurant = useSearchStore(s => s.selectedRestaurant)
  const setSelectedRestaurant = useSearchStore(s => s.setSelectedRestaurant)
  const filters = useSearchStore(s => s.filters)
  const setFilters = useSearchStore(s => s.setFilters)

  const { isFavorite, toggleFavorite } = useFavoriteStore()
  const listRef = useRef<HTMLDivElement>(null)

  const {
    data: restaurants = [],
    isLoading,
    isError,
    refetch,
  } = useRestaurantSearch(centerCoords, radius, filters.category)

  // 정렬 적용
  const sorted = [...restaurants].sort((a, b) => {
    if (filters.sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
    if (filters.sortBy === 'reviewCount')
      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
    return a.distance - b.distance
  })

  const currentSortLabel =
    SORT_OPTIONS.find(o => o.value === filters.sortBy)?.label ?? '거리순'

  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(listRef, {
    onRefresh: async () => {
      await refetch()
    },
  })

  return (
    <div className="flex h-[calc(100svh-60px)] flex-col">
      <Header
        rightSlot={
          <button
            type="button"
            onClick={() => setViewMode(v => (v === 'list' ? 'map' : 'list'))}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
          >
            {viewMode === 'list' ? <Map size={15} /> : <List size={15} />}
            {viewMode === 'list' ? '지도' : '목록'}
          </button>
        }
      />

      {/* 검색 / 필터 */}
      <div className="space-y-2.5 border-b border-gray-100 bg-white px-4 pt-3 pb-2">
        <LocationSearchInput
          onSelect={() => {}}
          placeholder="장소를 입력하세요"
        />

        {centerLabel && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-400" />
            {centerLabel} 기준
          </p>
        )}

        {/* 반경 슬라이더 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">검색 반경</span>
            <span className="text-xs font-semibold text-orange-500">
              {radius >= 1000
                ? `${(radius / 1000).toFixed(1)}km`
                : `${radius}m`}
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-orange-500"
            aria-label="검색 반경 슬라이더"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>50m</span>
            <span>500m</span>
            <span>1km</span>
            <span>2km</span>
          </div>
        </div>
      </div>

      {/* 카테고리 + 정렬 */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-2.5">
        <div className="scrollbar-hide flex flex-1 gap-1.5 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilters({ category: cat })}
              className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filters.category === cat
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowSortMenu(v => !v)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-600"
          >
            <SlidersHorizontal size={13} />
            {currentSortLabel}
            <ChevronDown size={13} />
          </button>
          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortMenu(false)}
              />
              <div className="absolute top-full right-0 z-20 mt-1 min-w-[100px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFilters({ sortBy: opt.value })
                      setShowSortMenu(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs transition-colors hover:bg-gray-50 ${
                      filters.sortBy === opt.value
                        ? 'font-semibold text-orange-500'
                        : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 본문 */}
      {viewMode === 'map' ? (
        <MapView className="flex-1" />
      ) : (
        <div
          ref={listRef}
          className="relative flex-1 overflow-y-auto bg-gray-50"
        >
          {/* Pull-to-refresh 인디케이터 */}
          {(isPulling || isRefreshing) && (
            <div
              className="flex items-center justify-center overflow-hidden transition-all"
              style={{ height: pullDistance || (isRefreshing ? 48 : 0) }}
            >
              <RefreshCw
                size={18}
                className={`text-orange-400 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </div>
          )}
          {/* 좌표 미설정 */}
          {!centerCoords && (
            <EmptyState
              icon="📍"
              title="위치를 설정해주세요"
              description="홈에서 현재 위치 또는 장소를 검색하세요"
              actionLabel="홈으로"
              onAction={() => navigate('/')}
            />
          )}

          {/* 로딩 */}
          {centerCoords && isLoading && (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* 에러 */}
          {centerCoords && isError && (
            <EmptyState
              icon="⚠️"
              title="검색 중 오류가 발생했어요"
              description="잠시 후 다시 시도해주세요"
              actionLabel="다시 시도"
              onAction={() => refetch()}
            />
          )}

          {/* 결과 없음 */}
          {centerCoords && !isLoading && !isError && sorted.length === 0 && (
            <EmptyState
              icon="🍽️"
              title="근처에 맛집이 없어요"
              description="반경을 넓히거나 다른 카테고리를 선택해보세요"
              actionLabel="반경 넓히기"
              onAction={() => setRadius(1000)}
            />
          )}

          {/* 결과 목록 */}
          {sorted.length > 0 && (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">총 {sorted.length}개</p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="새로고침"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/curation')}
                  className="gap-1"
                >
                  <Sparkles size={13} />
                  AI 추천받기
                </Button>
              </div>

              <div className="divide-y divide-gray-100 bg-white">
                {sorted.map(r => (
                  <RestaurantCard
                    key={r.id}
                    restaurant={r}
                    isSelected={selectedRestaurant?.id === r.id}
                    isFavorite={isFavorite(r.id)}
                    onFavoriteToggle={() => toggleFavorite(r)}
                    onClick={() => {
                      window.location.href = `https://place.map.kakao.com/${r.id}`
                    }}
                  />
                ))}
              </div>
            </>
          )}
          <ScrollToTopFAB scrollRef={listRef} />
        </div>
      )}
    </div>
  )
}
