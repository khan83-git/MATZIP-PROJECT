import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Navigation, Search } from 'lucide-react'
import { useLocationStore } from '@/store/locationStore'
import { useSearchStore } from '@/store/searchStore'
import { geocodeSearch } from '@/api/geocode'
import Button from '@/components/common/Button'
import LocationSearchInput from '@/components/common/LocationSearchInput'
import { MoodChipList } from '@/components/common/MoodChip'
import type { MoodType } from '@/types'

export default function HomePage() {
  const navigate = useNavigate()
  const [isLocating, setIsLocating] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [locationText, setLocationText] = useState('')
  const [locationError, setLocationError] = useState('')

  const setCenterCoords = useLocationStore(s => s.setCenterCoords)
  const setCurrentCoords = useLocationStore(s => s.setCurrentCoords)
  const selectedMood = useSearchStore(s => s.selectedMood)
  const setSelectedMood = useSearchStore(s => s.setSelectedMood)
  const addRecentSearch = useSearchStore(s => s.addRecentSearch)

  const goToSearch = () => {
    navigate('/search')
  }

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
        goToSearch()
      },
      () => {
        setLocationError('위치 권한을 허용해 주세요.')
        setIsLocating(false)
      },
      { timeout: 8000 }
    )
  }

  const handleLocationSelect = () => {
    goToSearch()
  }

  const handleLocationSubmit = async (text: string) => {
    if (!text.trim()) return
    setIsSearching(true)
    setLocationError('')
    try {
      const results = await geocodeSearch(text)
      if (results.length > 0) {
        setCenterCoords(results[0].coords, results[0].name)
        addRecentSearch(results[0].name)
        goToSearch()
      } else {
        setLocationError(
          '해당 장소를 찾을 수 없어요. 다른 검색어를 입력해보세요.'
        )
      }
    } catch {
      setLocationError(
        '장소 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      )
    } finally {
      setIsSearching(false)
    }
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

      {/* 모임 성격 선택 */}
      <div className="mt-5 px-4">
        <p className="mb-3 text-sm font-semibold text-gray-700">
          어떤 모임인가요?
        </p>
        <MoodChipList selected={selectedMood} onChange={handleMoodChange} />
        {selectedMood ? (
          <p className="mt-2 text-xs text-orange-500">
            선택됨 — 검색하면 AI가 바로 맞춤 추천해드려요 ✨
          </p>
        ) : (
          <p className="mt-2 text-xs text-gray-400">
            모임을 선택하면 AI 추천까지 한 번에!
          </p>
        )}
      </div>

      {/* 검색 카드 */}
      <div className="mx-4 mt-4 space-y-4 rounded-2xl bg-white p-5 shadow-md">
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

        <LocationSearchInput
          value={locationText}
          onChange={setLocationText}
          onSelect={handleLocationSelect}
          onSubmit={handleLocationSubmit}
        />

        <Button
          fullWidth
          variant="outline"
          isLoading={isSearching}
          disabled={!locationText.trim()}
          onClick={() => handleLocationSubmit(locationText)}
          className="gap-2"
        >
          <Search size={16} />
          장소로 맛집 찾기
        </Button>

        {locationError && (
          <p className="text-center text-xs text-red-500">{locationError}</p>
        )}
      </div>

      {/* 이용 방법 */}
      <div className="mt-8 mb-6 space-y-3 px-4">
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
          이용 방법
        </p>
        {[
          { step: '1', text: '모임 성격을 먼저 선택하세요' },
          { step: '2', text: '현재 위치 또는 장소를 입력하세요' },
          { step: '3', text: 'AI가 모임에 맞는 맛집을 골라드려요' },
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
