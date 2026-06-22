import { useState, useRef, useEffect } from 'react'
import { Search, X, MapPin, Loader2, ArrowRight } from 'lucide-react'
import { useGeocodeSearch } from '@/hooks/useGeocodeSearch'

import { useLocationStore } from '@/store/locationStore'
import { useSearchStore } from '@/store/searchStore'
import type { GeocodeResult } from '@/types'

interface LocationSearchInputProps {
  value?: string
  onChange?: (val: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  onSelect?: (result: GeocodeResult) => void
  className?: string
}

export default function LocationSearchInput({
  value: controlledValue,
  onChange: onChangeProp,
  onSubmit,
  placeholder = '장소를 입력하세요 (예: 강남역, 홍대입구)',
  onSelect,
  className = '',
}: LocationSearchInputProps) {
  const [internalValue, setInternalValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = controlledValue !== undefined
  const inputValue = isControlled ? controlledValue : internalValue

  const setCenterCoords = useLocationStore(s => s.setCenterCoords)
  const addRecentSearch = useSearchStore(s => s.addRecentSearch)
  const recentSearches = useSearchStore(s => s.recentSearches)

  const { results, isLoading } = useGeocodeSearch(inputValue)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const setInputValue = (val: string) => {
    if (isControlled) {
      onChangeProp?.(val)
    } else {
      setInternalValue(val)
    }
  }

  const handleSelect = (result: GeocodeResult) => {
    setInputValue(result.name)
    setIsOpen(false)
    setCenterCoords(result.coords, result.name)
    addRecentSearch(result.name)
    onSelect?.(result)
  }

  const handleClear = () => {
    setInputValue('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleSubmit = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (results.length > 0) {
      handleSelect(results[0])
    } else {
      onSubmit?.(trimmed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const showRecent = inputValue.length === 0 && recentSearches.length > 0
  const showResults = inputValue.length >= 2 && results.length > 0
  const dropdownVisible = isOpen && (showRecent || showResults || isLoading)

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 입력 필드 */}
      <div className="relative flex items-center">
        {isLoading ? (
          <Loader2
            size={17}
            className="pointer-events-none absolute left-3 animate-spin text-orange-400"
          />
        ) : (
          <Search
            size={17}
            className="pointer-events-none absolute left-3 text-gray-400"
          />
        )}
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl bg-gray-100 pl-9 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-400"
          style={{ paddingRight: inputValue ? '4rem' : '0.75rem' }}
        />
        {inputValue && (
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label="지우기"
            >
              <X size={14} />
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-orange-500 p-1 text-white hover:bg-orange-600"
              aria-label="검색"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* 드롭다운 */}
      {dropdownVisible && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-hidden overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-lg">
          {/* 최근 검색어 */}
          {showRecent && (
            <>
              <p className="px-4 pt-3 pb-1 text-xs font-medium text-gray-400">
                최근 검색
              </p>
              {recentSearches.slice(0, 5).map(keyword => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => {
                    setInputValue(keyword)
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Search size={14} className="shrink-0 text-gray-300" />
                  {keyword}
                </button>
              ))}
            </>
          )}

          {/* 검색 결과 */}
          {showResults &&
            results.map(result => (
              <button
                key={`${result.coords.lat}-${result.coords.lng}`}
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-start gap-2.5 px-4 py-3 text-left transition-colors hover:bg-orange-50"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-orange-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {result.name}
                  </p>
                  {result.address !== result.name && (
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {result.address}
                    </p>
                  )}
                </div>
              </button>
            ))}

          {/* 검색했는데 결과 없음 */}
          {inputValue.length >= 2 && !isLoading && results.length === 0 && (
            <p className="px-4 py-4 text-center text-sm text-gray-400">
              검색 결과가 없어요
            </p>
          )}
        </div>
      )}
    </div>
  )
}
