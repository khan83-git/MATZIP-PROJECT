import { useParams } from 'react-router-dom'

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="p-4">
      <p className="text-gray-500 text-sm">맛집 상세 (ID: {id}) — Phase 3에서 구현</p>
    </div>
  )
}
