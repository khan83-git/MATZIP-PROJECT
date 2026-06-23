import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import EmptyState from '@/components/common/EmptyState'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import { useFavoriteStore } from '@/store/favoriteStore'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, isFavorite, toggleFavorite } = useFavoriteStore()

  return (
    <div className="flex h-[calc(100svh-60px)] flex-col">
      <Header
        title="즐겨찾기"
        rightSlot={
          favorites.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('즐겨찾기를 모두 삭제할까요?')) {
                  favorites.forEach(r => toggleFavorite(r))
                }
              }}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-400"
              aria-label="즐겨찾기 전체 삭제"
            >
              <Trash2 size={18} />
            </button>
          ) : undefined
        }
      />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {favorites.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="즐겨찾기한 맛집이 없어요"
            description="맛집 상세 화면에서 하트를 눌러 저장해보세요"
            actionLabel="맛집 찾으러 가기"
            onAction={() => navigate('/')}
          />
        ) : (
          <>
            <div className="border-b border-gray-100 bg-white px-4 py-2.5">
              <p className="text-xs text-gray-500">총 {favorites.length}개</p>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              {favorites.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isFavorite={isFavorite(restaurant.id)}
                  onFavoriteToggle={() => toggleFavorite(restaurant)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
