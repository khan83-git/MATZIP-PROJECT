import { WifiOff } from 'lucide-react'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export default function OfflineBanner() {
  const isOnline = useNetworkStatus()

  if (isOnline) return null

  return (
    <div
      role="alert"
      className="flex items-center justify-center gap-2 bg-gray-800 px-4 py-2 text-xs font-medium text-white"
    >
      <WifiOff size={13} />
      인터넷에 연결되지 않았어요
    </div>
  )
}
