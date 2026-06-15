import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { searchRestaurants } from '@/api/restaurants'
import { useSearchStore } from '@/store/searchStore'
import type { LatLng } from '@/types'

export function useRestaurantSearch(
  coords: LatLng | null,
  radius: number,
  category: string
) {
  const setRestaurants = useSearchStore(s => s.setRestaurants)

  const query = useQuery({
    queryKey: ['restaurants', coords?.lat, coords?.lng, radius, category],
    queryFn: () => searchRestaurants({ coords: coords!, radius, category }),
    enabled: !!coords,
    staleTime: 5 * 60 * 1000,
  })

  // 결과를 Zustand 스토어에 동기화 (지도 마커에서도 접근 가능하도록)
  useEffect(() => {
    if (query.data) setRestaurants(query.data)
  }, [query.data, setRestaurants])

  return query
}
