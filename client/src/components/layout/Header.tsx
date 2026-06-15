import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  showBack?: boolean
  rightSlot?: React.ReactNode
}

export default function Header({
  title,
  showBack = false,
  rightSlot,
}: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-gray-100 bg-white px-4">
      {showBack && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mr-2 -ml-1 rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100"
          aria-label="뒤로 가기"
        >
          <ArrowLeft size={22} />
        </button>
      )}
      {title && (
        <h1 className="flex-1 truncate text-base font-semibold text-gray-900">
          {title}
        </h1>
      )}
      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
    </header>
  )
}
