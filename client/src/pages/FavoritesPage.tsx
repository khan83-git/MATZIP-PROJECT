import Header from '@/components/layout/Header'
import EmptyState from '@/components/common/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function FavoritesPage() {
  const navigate = useNavigate()
  // Phase 5에서 실제 즐겨찾기 스토어 연동
  const favorites: unknown[] = []

  return (
    <div className="flex h-[calc(100svh-60px)] flex-col">
      <Header title="즐겨찾기" />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {favorites.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="즐겨찾기한 맛집이 없어요"
            description="맛집 상세 화면에서 하트를 눌러 저장해보세요"
            actionLabel="맛집 찾으러 가기"
            onAction={() => navigate('/')}
          />
        ) : null}
      </div>
    </div>
  )
}
