import { Router, Request, Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MOOD_LABELS: Record<string, string> = {
  hoesik: '회식',
  date: '데이트',
  business: '비즈니스 미팅',
  family: '가족 모임',
  friends: '친구 모임',
}

router.post('/', async (req: Request, res: Response) => {
  const { restaurants, moodType } = req.body as {
    restaurants: unknown[]
    moodType: string
  }

  if (!restaurants?.length || !moodType) {
    res.status(400).json({ message: '맛집 목록과 모임 유형이 필요합니다.' })
    return
  }

  const moodLabel = MOOD_LABELS[moodType] ?? moodType

  try {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `당신은 맛집 전문 큐레이터입니다. 주어진 맛집 목록과 모임 성격을 분석하여
최적의 맛집을 추천하고 각 맛집에 대한 맞춤 추천 코멘트를 작성합니다.
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "recommendations": [
    {
      "restaurantId": "string",
      "rank": 1,
      "summary": "한 줄 요약 (20자 이내)",
      "comment": "추천 이유 (100자 이내)",
      "tags": ["태그1", "태그2"]
    }
  ],
  "overallComment": "전체 큐레이션 요약 멘트 (50자 이내)"
}`,
      messages: [
        {
          role: 'user',
          content: `모임 성격: ${moodLabel}\n\n후보 맛집 목록:\n${JSON.stringify(restaurants, null, 2)}\n\n위 맛집 중 ${moodLabel}에 가장 적합한 3~5곳을 추천해주세요.`,
        },
      ],
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'AI 추천 생성에 실패했습니다.' })
    }
  }
})

export default router
