import type { CurationResult, MoodType, Restaurant } from '@/types'

export interface CurationChunk {
  text: string
}

export interface CurationFinalResult {
  recommendations: CurationResult[]
  overallComment: string
}

export async function streamCuration(
  restaurants: Restaurant[],
  moodType: MoodType,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<CurationFinalResult> {
  const response = await fetch('/api/curate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurants, moodType }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`AI 추천 요청 실패: ${response.status}`)
  }
  if (!response.body) {
    throw new Error('스트림 응답 없음')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let accumulated = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') continue
      try {
        const parsed = JSON.parse(data) as CurationChunk
        accumulated += parsed.text
        onChunk(accumulated)
      } catch {
        // 불완전 청크 무시
      }
    }
  }

  const jsonMatch = accumulated.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI 응답 파싱 실패')

  const result = JSON.parse(jsonMatch[0]) as CurationFinalResult
  return result
}
