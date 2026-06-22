import { Router, Request, Response } from 'express'

const router = Router()

interface KakaoDocument {
  place_name: string
  road_address_name: string
  address_name: string
  x: string
  y: string
}

interface KakaoSearchResponse {
  documents: KakaoDocument[]
}

router.get('/', async (req: Request, res: Response) => {
  const query = req.query.query as string

  if (!query?.trim()) {
    res.status(400).json({ message: '검색어가 필요합니다.' })
    return
  }

  console.log(`[geocode] 검색: ${query}`)

  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=5`
    const response = await globalThis.fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_API_KEY ?? ''}`,
      },
    })

    if (!response.ok) {
      console.error(`[geocode] 카카오 API 오류: HTTP ${response.status}`)
      res
        .status(502)
        .json({ message: '위치 검색 서비스에 일시적인 문제가 있습니다.' })
      return
    }

    const data = (await response.json()) as KakaoSearchResponse
    console.log(`[geocode] 결과: ${data.documents?.length ?? 0}개`)

    if (!data.documents?.length) {
      res.json({ results: [] })
      return
    }

    const results = data.documents.slice(0, 5).map(doc => ({
      name: doc.place_name,
      address: doc.road_address_name || doc.address_name,
      coords: {
        lat: parseFloat(doc.y),
        lng: parseFloat(doc.x),
      },
    }))

    res.json({ results })
  } catch (err) {
    console.error('[geocode] 오류:', err)
    res.status(500).json({ message: '위치 검색에 실패했습니다.' })
  }
})

export default router
