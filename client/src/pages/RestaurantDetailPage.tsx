import { useNavigate, useParams } from 'react-router-dom'
import {
  Phone,
  MapPin,
  Star,
  ExternalLink,
  Sparkles,
  Heart,
  Navigation,
} from 'lucide-react'
import { useState } from 'react'
import { useSearchStore } from '@/store/searchStore'
import Header from '@/components/layout/Header'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'

function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`
}

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

  const restaurants = useSearchStore(s => s.restaurants)
  const restaurant = restaurants.find(r => r.id === id)

  if (!restaurant) {
    return (
      <div className="flex h-full flex-col">
        <Header title="맛집 상세" showBack />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <span className="text-4xl">🍽️</span>
          <p className="text-sm text-gray-500">맛집 정보를 불러올 수 없어요</p>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100svh-60px)] flex-col">
      <Header
        title={restaurant.name}
        showBack
        rightSlot={
          <button
            type="button"
            onClick={() => setIsFavorite(v => !v)}
            className="rounded-full p-1.5 hover:bg-gray-100"
            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <Heart
              size={20}
              className={
                isFavorite ? 'fill-red-400 text-red-400' : 'text-gray-400'
              }
            />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* 이미지 영역 (Phase 3에서 실제 이미지 연동) */}
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 text-6xl">
          {restaurant.category.includes('카페')
            ? '☕'
            : restaurant.category.includes('일식')
              ? '🍱'
              : restaurant.category.includes('중식')
                ? '🥟'
                : restaurant.category.includes('양식')
                  ? '🍝'
                  : '🍽️'}
        </div>

        <div className="space-y-4 bg-white px-5 py-5">
          {/* 기본 정보 */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="orange">{restaurant.category}</Badge>
              <span className="flex items-center gap-0.5 text-xs text-gray-400">
                <Navigation size={11} />
                {formatDistance(restaurant.distance)}
              </span>
              {restaurant.rating && (
                <span className="flex items-center gap-0.5 text-xs text-amber-500">
                  <Star size={11} className="fill-amber-400" />
                  {restaurant.rating.toFixed(1)}
                  {restaurant.reviewCount && (
                    <span className="ml-0.5 text-gray-400">
                      ({restaurant.reviewCount})
                    </span>
                  )}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {restaurant.name}
            </h2>
          </div>

          {/* 주소 */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
            <span>{restaurant.address}</span>
          </div>

          {/* 전화번호 */}
          {restaurant.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={16} className="text-gray-400" />
              <a
                href={`tel:${restaurant.phone}`}
                className="hover:text-orange-500"
              >
                {restaurant.phone}
              </a>
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
          {restaurant.naverPlaceUrl && (
            <a
              href={restaurant.naverPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ExternalLink size={15} />
              네이버 지도
            </a>
          )}
          <Button
            fullWidth
            onClick={() => navigate('/curation')}
            className="gap-2"
          >
            <Sparkles size={15} />
            AI 추천 받기
          </Button>
        </div>
      </div>
    </div>
  )
}
