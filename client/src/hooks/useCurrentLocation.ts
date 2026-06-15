import { useState, useCallback } from 'react'
import type { LatLng } from '@/types'

interface LocationState {
  coords: LatLng | null
  isLoading: boolean
  error: string | null
}

export function useCurrentLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    isLoading: false,
    error: null,
  })

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({
        ...s,
        error: '위치 서비스를 지원하지 않는 브라우저입니다.',
      }))
      return
    }

    setState(s => ({ ...s, isLoading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setState({ coords, isLoading: false, error: null })
      },
      err => {
        const message =
          err.code === GeolocationPositionError.PERMISSION_DENIED
            ? '위치 권한을 허용해 주세요.'
            : '위치를 가져올 수 없습니다. 다시 시도해주세요.'
        setState(s => ({ ...s, isLoading: false, error: message }))
      },
      { timeout: 8000, maximumAge: 30000 }
    )
  }, [])

  return { ...state, requestLocation }
}
