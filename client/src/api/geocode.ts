import apiClient from '@/lib/axios'
import type { GeocodeResult } from '@/types'

export type { GeocodeResult }

export async function geocodeSearch(query: string): Promise<GeocodeResult[]> {
  const { data } = await apiClient.get<{ results: GeocodeResult[] }>(
    '/geocode',
    {
      params: { query },
    }
  )
  return data.results
}
