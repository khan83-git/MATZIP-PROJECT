import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Restaurant } from '@/types'

interface FavoriteStore {
  favorites: Restaurant[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (restaurant: Restaurant) => void
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: id => get().favorites.some(r => r.id === id),
      toggleFavorite: restaurant => {
        const { favorites } = get()
        const exists = favorites.some(r => r.id === restaurant.id)
        set({
          favorites: exists
            ? favorites.filter(r => r.id !== restaurant.id)
            : [restaurant, ...favorites],
        })
      },
    }),
    { name: 'matzip-favorites' }
  )
)
