import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import type { LatLng } from '@/types'

export interface NaverMapHandle {
  getMap: () => naver.maps.Map | null
  panTo: (coords: LatLng) => void
}

interface NaverMapProps {
  center: LatLng
  zoom?: number
  className?: string
  onMapReady?: (map: naver.maps.Map) => void
}

const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 } // 서울 시청

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(function NaverMap(
  { center, zoom = 16, className = '', onMapReady },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<naver.maps.Map | null>(null)
  const isReadyRef = useRef(false)

  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
    panTo: (coords: LatLng) => {
      mapRef.current?.panTo(new naver.maps.LatLng(coords.lat, coords.lng))
    },
  }))

  // 지도 초기화 — 최초 1회만
  useEffect(() => {
    if (!containerRef.current) return

    const initMap = () => {
      if (!window.naver?.maps || !containerRef.current || isReadyRef.current)
        return

      const map = new naver.maps.Map(containerRef.current, {
        center: new naver.maps.LatLng(center.lat, center.lng),
        zoom,
        zoomControl: false,
        mapTypeControl: false,
      })

      mapRef.current = map
      isReadyRef.current = true
      onMapReady?.(map)
    }

    // 스크립트가 이미 로드됐으면 바로 초기화, 아니면 로드 대기
    if (window.naver?.maps) {
      initMap()
    } else {
      const timer = setInterval(() => {
        if (window.naver?.maps) {
          clearInterval(timer)
          initMap()
        }
      }, 100)
      return () => clearInterval(timer)
    }

    return () => {
      mapRef.current?.destroy()
      mapRef.current = null
      isReadyRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 중심 좌표 변경 시 지도 이동
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.setCenter(new naver.maps.LatLng(center.lat, center.lng))
  }, [center.lat, center.lng])

  return <div ref={containerRef} className={className} />
})

export default NaverMap
export { DEFAULT_CENTER }
