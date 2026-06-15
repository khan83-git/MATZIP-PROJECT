import apiClient from '@/lib/axios'
import type { Restaurant, LatLng } from '@/types'

interface SearchParams {
  coords: LatLng
  radius: number
  category: string
}

export async function searchRestaurants({
  coords,
  radius,
  category,
}: SearchParams): Promise<Restaurant[]> {
  const { data } = await apiClient.post<{ restaurants: Restaurant[] }>(
    '/restaurants',
    {
      lat: coords.lat,
      lng: coords.lng,
      radius,
      category,
    }
  )
  return data.restaurants
}
