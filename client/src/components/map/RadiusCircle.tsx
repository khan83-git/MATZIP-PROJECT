import { useEffect, useRef } from 'react'
import type { LatLng } from '@/types'

interface RadiusCircleProps {
  map: naver.maps.Map | null
  center: LatLng
  radius: number
}

export default function RadiusCircle({
  map,
  center,
  radius,
}: RadiusCircleProps) {
  const circleRef = useRef<naver.maps.Circle | null>(null)

  useEffect(() => {
    if (!map || !window.naver?.maps) return

    const circle = new naver.maps.Circle({
      map,
      center: new naver.maps.LatLng(center.lat, center.lng),
      radius,
      strokeColor: '#f97316',
      strokeOpacity: 0.7,
      strokeWeight: 2,
      fillColor: '#f97316',
      fillOpacity: 0.07,
    })

    circleRef.current = circle

    return () => {
      circle.setMap(null)
      circleRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  useEffect(() => {
    circleRef.current?.setCenter(new naver.maps.LatLng(center.lat, center.lng))
  }, [center.lat, center.lng])

  useEffect(() => {
    circleRef.current?.setRadius(radius)
  }, [radius])

  return null
}
