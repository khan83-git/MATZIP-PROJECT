import { useEffect, useRef } from 'react'
import type { LatLng } from '@/types'

interface CurrentLocationMarkerProps {
  map: naver.maps.Map | null
  coords: LatLng
}

// 파란 점 마커 HTML
const MARKER_HTML = `
  <div style="position:relative;width:20px;height:20px">
    <div style="
      position:absolute;inset:0;
      background:rgba(59,130,246,0.2);
      border-radius:50%;
      animation:pulse 2s ease-in-out infinite;
    "></div>
    <div style="
      position:absolute;inset:4px;
      background:#3b82f6;
      border:2px solid #fff;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,.25);
    "></div>
  </div>
  <style>
    @keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.6);opacity:.2}}
  </style>
`

export default function CurrentLocationMarker({
  map,
  coords,
}: CurrentLocationMarkerProps) {
  const markerRef = useRef<naver.maps.Marker | null>(null)

  useEffect(() => {
    if (!map || !window.naver?.maps) return

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(coords.lat, coords.lng),
      icon: { content: MARKER_HTML },
      zIndex: 100,
    })

    markerRef.current = marker

    return () => {
      marker.setMap(null)
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  useEffect(() => {
    markerRef.current?.setPosition(
      new naver.maps.LatLng(coords.lat, coords.lng)
    )
  }, [coords.lat, coords.lng])

  return null
}
