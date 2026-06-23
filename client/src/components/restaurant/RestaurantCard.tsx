import { memo } from 'react'
import { Star, MapPin, Phone, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/common/Badge'
import type { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
  isFavorite?: boolean
  onFavoriteToggle?: (id: string) => void
  isSelected?: boolean
  onClick?: () => void
}

function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`
}

const RestaurantCard = memo(function RestaurantCard({
  restaurant,
  isFavorite = false,
  onFavoriteToggle,
  isSelected = false,
  onClick,
}: RestaurantCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    onClick?.()
    navigate(`/restaurant/${restaurant.id}`)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      className={`flex cursor-pointer gap-3 bg-white p-4 transition-colors active:bg-gray-50 ${
        isSelected ? 'border-l-4 border-orange-400' : ''
      }`}
    >
      {/* 썸네일 */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={e => {
              e.currentTarget.parentElement!.innerHTML = `<div class="flex h-full w-full items-center justify-center text-2xl">${
                restaurant.category.includes('카페')
                  ? '☕'
                  : restaurant.category.includes('일식')
                    ? '🍱'
                    : restaurant.category.includes('중식')
                      ? '🥟'
                      : restaurant.category.includes('양식')
                        ? '🍝'
                        : '🍽️'
              }</div>`
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">
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
        )}
      </div>

      {/* 정보 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {restaurant.name}
          </p>
          {onFavoriteToggle && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onFavoriteToggle(restaurant.id)
              }}
              className="shrink-0 p-0.5 text-gray-300 transition-colors hover:text-red-400"
              aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              <Heart
                size={16}
                className={isFavorite ? 'fill-red-400 text-red-400' : ''}
              />
            </button>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant="gray">{restaurant.category}</Badge>
          <span className="flex items-center gap-0.5 text-xs text-gray-400">
            <MapPin size={11} />
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

        <p className="mt-1 truncate text-xs text-gray-400">
          {restaurant.address}
        </p>

        {restaurant.phone && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
            <Phone size={11} />
            {restaurant.phone}
          </p>
        )}
      </div>
    </div>
  )
})

export default RestaurantCard
