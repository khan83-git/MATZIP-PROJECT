import { Search, X } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string
  onClear?: () => void
}

export default function SearchInput({
  value,
  onClear,
  className = '',
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={18}
        className="pointer-events-none absolute left-3 text-gray-400"
      />
      <input
        type="search"
        value={value}
        className="h-11 w-full rounded-xl bg-gray-100 pr-9 pl-9 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-400"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
          aria-label="검색어 지우기"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
