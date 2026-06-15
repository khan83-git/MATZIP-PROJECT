import { useEffect, useRef } from 'react'
import type { Restaurant } from '@/types'

interface RestaurantMarkersProps {
  map: naver.maps.Map | null
  restaurants: Restaurant[]
  selectedId: string | null
  onMarkerClick: (restaurant: Restaurant) => void
}

// 업종별 이모지
function getCategoryEmoji(category: string): string {
  if (category.includes('카페')) return '☕'
  if (category.includes('일식')) return '🍱'
  if (category.includes('중식')) return '🥟'
  if (category.includes('양식')) return '🍝'
  return '🍽️'
}

function makeMarkerHTML(emoji: string, isSelected: boolean): string {
  const bg = isSelected ? '#f97316' : '#ffffff'
  const border = isSelected ? '#ea580c' : '#e5e7eb'
  const shadow = isSelected
    ? '0 2px 8px rgba(249,115,22,.5)'
    : '0 2px 6px rgba(0,0,0,.15)'
  const scale = isSelected ? 'scale(1.2)' : 'scale(1)'

  return `
    <div style="
      display:flex;align-items:center;justify-content:center;
      width:36px;height:36px;
      background:${bg};border:2px solid ${border};
      border-radius:50%;font-size:16px;
      box-shadow:${shadow};
      transform:${scale};transition:transform .15s;
      cursor:pointer;
    ">${emoji}</div>
    <div style="
      width:0;height:0;
      border-left:5px solid transparent;
      border-right:5px solid transparent;
      border-top:6px solid ${border};
      margin:0 auto;
    "></div>
  `
}

export default function RestaurantMarkers({
  map,
  restaurants,
  selectedId,
  onMarkerClick,
}: RestaurantMarkersProps) {
  const markersRef = useRef<Map<string, naver.maps.Marker>>(new Map())
  const listenersRef = useRef<Map<string, unknown>>(new Map())

  useEffect(() => {
    if (!map || !window.naver?.maps) return

    // 사라진 마커 제거
    const currentIds = new Set(restaurants.map(r => r.id))
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.setMap(null)
        markersRef.current.delete(id)
      }
    })

    // 새 마커 추가 / 기존 마커 갱신
    restaurants.forEach(restaurant => {
      const isSelected = restaurant.id === selectedId
      const emoji = getCategoryEmoji(restaurant.category)
      const html = makeMarkerHTML(emoji, isSelected)

      if (markersRef.current.has(restaurant.id)) {
        const marker = markersRef.current.get(restaurant.id)!
        marker.setIcon({ content: html })
        marker.setZIndex(isSelected ? 50 : 10)
      } else {
        const marker = new naver.maps.Marker({
          map,
          position: new naver.maps.LatLng(
            restaurant.coords.lat,
            restaurant.coords.lng
          ),
          icon: { content: html },
          zIndex: isSelected ? 50 : 10,
        })

        const listener = naver.maps.Event.addListener(marker, 'click', () => {
          onMarkerClick(restaurant)
        })

        markersRef.current.set(restaurant.id, marker)
        listenersRef.current.set(restaurant.id, listener)
      }
    })

    return () => {
      // 컴포넌트 언마운트 시 모든 마커 제거
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current.clear()
      listenersRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, restaurants, selectedId])

  return null
}
