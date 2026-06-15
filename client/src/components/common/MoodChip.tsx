import type { MoodOption, MoodType } from '@/types'

const MOOD_OPTIONS: MoodOption[] = [
  {
    type: 'hoesik',
    label: '회식',
    emoji: '🍻',
    description: '넓고 시끌벅적한 곳',
  },
  { type: 'date', label: '데이트', emoji: '💑', description: '분위기 좋은 곳' },
  {
    type: 'business',
    label: '비즈니스',
    emoji: '💼',
    description: '격식 있는 곳',
  },
  { type: 'family', label: '가족', emoji: '👨‍👩‍👧', description: '아이 친화 식당' },
  {
    type: 'friends',
    label: '친구',
    emoji: '🎉',
    description: '가성비 좋은 곳',
  },
]

interface MoodChipListProps {
  selected: MoodType | null
  onChange: (mood: MoodType) => void
}

export function MoodChipList({ selected, onChange }: MoodChipListProps) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto py-1">
      {MOOD_OPTIONS.map(opt => (
        <button
          key={opt.type}
          type="button"
          onClick={() => onChange(opt.type)}
          className={`flex flex-shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-4 py-2.5 text-xs font-medium transition-all ${
            selected === opt.type
              ? 'border-orange-400 bg-orange-50 text-orange-600'
              : 'border-gray-200 bg-white text-gray-600'
          }`}
        >
          <span className="text-xl">{opt.emoji}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

export { MOOD_OPTIONS }
