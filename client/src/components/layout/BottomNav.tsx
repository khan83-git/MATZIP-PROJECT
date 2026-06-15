import { NavLink } from 'react-router-dom'
import { Home, Search, Heart } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/search', icon: Search, label: '검색' },
  { to: '/favorites', icon: Heart, label: '즐겨찾기' },
] as const

export default function BottomNav() {
  return (
    <nav className="safe-bottom fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-100 bg-white">
      <ul className="flex">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
