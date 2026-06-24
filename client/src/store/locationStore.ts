import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LatLng, RadiusOption } from '@/types'

interface LocationStore {
  currentCoords: LatLng | null
  centerCoords: LatLng | null
  centerLabel: string
  radius: RadiusOption
  setCurrentCoords: (coords: LatLng) => void
  setCenterCoords: (coords: LatLng, label?: string) => void
  setRadius: (radius: RadiusOption) => void
}

export const useLocationStore = create<LocationStore>()(
  persist(
    set => ({
      currentCoords: null,
      centerCoords: null,
      centerLabel: '',
      radius: 100,
      setCurrentCoords: coords => set({ currentCoords: coords }),
      setCenterCoords: (coords, label = '') =>
        set({ centerCoords: coords, centerLabel: label }),
      setRadius: radius => set({ radius }),
    }),
    { name: 'matzip-location' }
  )
)
