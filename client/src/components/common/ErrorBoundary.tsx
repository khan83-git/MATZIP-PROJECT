import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-5xl">🚨</span>
            <div>
              <p className="font-semibold text-gray-800">
                예상치 못한 오류가 발생했어요
              </p>
              <p className="mt-1 text-xs text-gray-400">{this.state.message}</p>
            </div>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white active:bg-orange-600"
            >
              다시 시도
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
