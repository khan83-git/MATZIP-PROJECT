import { create } from 'zustand'
import type { Restaurant, SearchFilters, MoodType } from '@/types'

interface SearchStore {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  filters: SearchFilters;
  selectedMood: MoodType | null;
  recentSearches: string[];
  setRestaurants: (data: Restaurant[]) => void;
  setSelectedRestaurant: (r: Restaurant | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setSelectedMood: (mood: MoodType | null) => void;
  addRecentSearch: (keyword: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  restaurants: [],
  selectedRestaurant: null,
  filters: {
    category: '전체',
    sortBy: 'distance',
    radius: 300,
  },
  selectedMood: null,
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') ?? '[]'),
  setRestaurants: (data) => set({ restaurants: data }),
  setSelectedRestaurant: (r) => set({ selectedRestaurant: r }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setSelectedMood: (mood) => set({ selectedMood: mood }),
  addRecentSearch: (keyword) =>
    set((state) => {
      const next = [keyword, ...state.recentSearches.filter((s) => s !== keyword)].slice(0, 10)
      localStorage.setItem('recentSearches', JSON.stringify(next))
      return { recentSearches: next }
    }),
  clearRecentSearches: () => {
    localStorage.removeItem('recentSearches')
    set({ recentSearches: [] })
  },
}))
