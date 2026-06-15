import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Navigation } from 'lucide-react'
import { useLocationStore } from '@/store/locationStore'
import { useSearchStore } from '@/store/searchStore'
import Button from '@/components/common/Button'
import LocationSearchInput from '@/components/common/LocationSearchInput'
import { MoodChipList } from '@/components/common/MoodChip'
import type { MoodType } from '@/types'

export default function HomePage() {
  const navigate = useNavigate()
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  const setCenterCoords = useLocationStore(s => s.setCenterCoords)
  const setCurrentCoords = useLocationStore(s => s.setCurrentCoords)
  const selectedMood = useSearchStore(s => s.selectedMood)
  const setSelectedMood = useSearchStore(s => s.setSelectedMood)

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      return
    }
    setIsLocating(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCurrentCoords(coords)
        setCenterCoords(coords, '현재 위치')
        setIsLocating(false)
        navigate('/search')
      },
      () => {
        setLocationError('위치 권한을 허용해 주세요.')
        setIsLocating(false)
      },
      { timeout: 8000 }
    )
  }

  const handleLocationSelect = () => {
    navigate('/search')
  }

  const handleMoodChange = (mood: MoodType) => {
    setSelectedMood(selectedMood === mood ? null : mood)
  }

  return (
    <div className="flex min-h-[calc(100svh-60px)] flex-col bg-gray-50">
      {/* 히어로 */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 px-6 pt-14 pb-10 text-white">
        <div className="mb-1 flex items-center gap-2">
          <MapPin size={20} />
          <span className="text-sm font-medium opacity-90">지금 내 주변</span>
        </div>
        <h1 className="mb-1 text-3xl font-bold">맛ZIP</h1>
        <p className="text-sm opacity-80">
          AI가 모임에 딱 맞는 맛집을 골라드려요
        </p>
      </div>

      {/* 검색 카드 */}
      <div className="mx-4 -mt-6 space-y-4 rounded-2xl bg-white p-5 shadow-md">
        {/* 현재 위치 버튼 */}
        <Button
          fullWidth
          isLoading={isLocating}
          onClick={handleCurrentLocation}
          className="gap-2"
        >
          <Navigation size={16} />
          현재 위치로 맛집 찾기
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* 장소 검색 (자동완성) */}
        <LocationSearchInput onSelect={handleLocationSelect} />

        {locationError && (
          <p className="text-center text-xs text-red-500">{locationError}</p>
        )}
      </div>

      {/* 모임 성격 */}
      <div className="mt-6 px-4">
        <p className="mb-3 text-sm font-semibold text-gray-700">
          어떤 모임인가요?
        </p>
        <MoodChipList selected={selectedMood} onChange={handleMoodChange} />
        {selectedMood && (
          <p className="mt-2 text-xs text-orange-500">
            선택됨 — 검색 후 AI가 맞춤 추천해드려요
          </p>
        )}
      </div>

      {/* 사용 가이드 */}
      <div className="mt-8 mb-6 space-y-3 px-4">
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
          이용 방법
        </p>
        {[
          { step: '1', text: '현재 위치 또는 장소를 입력하세요' },
          { step: '2', text: '반경과 업종을 선택하세요' },
          { step: '3', text: 'AI 추천으로 최적의 맛집을 골라보세요' },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-500">
              {step}
            </span>
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
