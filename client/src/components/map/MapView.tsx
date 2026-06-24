import { useRef, useState, useEffect } from 'react'
import { useLocationStore } from '@/store/locationStore'
import { useSearchStore } from '@/store/searchStore'
import NaverMap, { DEFAULT_CENTER, type NaverMapHandle } from './NaverMap'
import CurrentLocationMarker from './CurrentLocationMarker'
import RadiusCircle from './RadiusCircle'
import RestaurantMarkers from './RestaurantMarkers'
import BottomSheet from '@/components/common/BottomSheet'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { MapPin, Star, Phone, Navigation, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Restaurant } from '@/types'

function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`
}

interface MapViewProps {
  className?: string
}

export default function MapView({ className = '' }: MapViewProps) {
  const navigate = useNavigate()
  const mapRef = useRef<NaverMapHandle>(null)
  const [naverMap, setNaverMap] = useState<naver.maps.Map | null>(null)
  const [sheetRestaurant, setSheetRestaurant] = useState<Restaurant | null>(
    null
  )

  const currentCoords = useLocationStore(s => s.currentCoords)
  const centerCoords = useLocationStore(s => s.centerCoords)
  const radius = useLocationStore(s => s.radius)

  const restaurants = useSearchStore(s => s.restaurants)
  const selectedRestaurant = useSearchStore(s => s.selectedRestaurant)
  const setSelectedRestaurant = useSearchStore(s => s.setSelectedRestaurant)

  const mapCenter = centerCoords ?? currentCoords ?? DEFAULT_CENTER

  const handleMarkerClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  useEffect(() => {
    if (selectedRestaurant) {
      setSheetRestaurant(selectedRestaurant)
      if (naverMap) {
        mapRef.current?.panTo(selectedRestaurant.coords)
      }
    }
  }, [selectedRestaurant, naverMap])

  const handleSheetClose = () => {
    setSheetRestaurant(null)
    setSelectedRestaurant(null)
  }

  return (
    <div className={`relative ${className}`}>
      <NaverMap
        ref={mapRef}
        center={mapCenter}
        zoom={16}
        className="h-full w-full"
        onMapReady={setNaverMap}
      />

      {currentCoords && (
        <CurrentLocationMarker map={naverMap} coords={currentCoords} />
      )}

      {centerCoords && (
        <RadiusCircle map={naverMap} center={centerCoords} radius={radius} />
      )}

      <RestaurantMarkers
        map={naverMap}
        restaurants={restaurants}
        selectedId={selectedRestaurant?.id ?? null}
        onMarkerClick={handleMarkerClick}
      />

      {/* 마커 클릭 시 맛집 미리보기 BottomSheet */}
      <BottomSheet
        isOpen={!!sheetRestaurant}
        onClose={handleSheetClose}
        title={sheetRestaurant?.name}
      >
        {sheetRestaurant && (
          <div className="space-y-3 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="orange">{sheetRestaurant.category}</Badge>
              <span className="flex items-center gap-0.5 text-xs text-gray-400">
                <Navigation size={11} />
                {formatDistance(sheetRestaurant.distance)}
              </span>
              {sheetRestaurant.rating && (
                <span className="flex items-center gap-0.5 text-xs text-amber-500">
                  <Star size={11} className="fill-amber-400" />
                  {sheetRestaurant.rating.toFixed(1)}
                  {sheetRestaurant.reviewCount && (
                    <span className="ml-0.5 text-gray-400">
                      ({sheetRestaurant.reviewCount})
                    </span>
                  )}
                </span>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />
              <span>{sheetRestaurant.address}</span>
            </div>

            {sheetRestaurant.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={15} className="text-gray-400" />
                <a href={`tel:${sheetRestaurant.phone}`}>
                  {sheetRestaurant.phone}
                </a>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate(`/restaurant/${sheetRestaurant.id}`)}
              >
                상세 보기
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  navigate('/curation')
                  handleSheetClose()
                }}
                className="gap-1"
              >
                <Sparkles size={14} />
                AI 추천
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
