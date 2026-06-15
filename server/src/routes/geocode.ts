import { Router, Request, Response } from 'express'

const router = Router()

interface NaverGeocodeAddress {
  roadAddress: string
  jibunAddress: string
  x: string
  y: string
}

router.get('/', async (req: Request, res: Response) => {
  const query = req.query.query as string

  if (!query?.trim()) {
    res.status(400).json({ message: '검색어가 필요합니다.' })
    return
  }

  console.log(`[geocode] 검색: ${query}`)

  try {
    const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`
    const response = await globalThis.fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID ?? '',
        'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET ?? '',
      },
    })

    if (!response.ok) {
      console.error(`[geocode] 네이버 API 오류: HTTP ${response.status}`)
      res
        .status(502)
        .json({ message: '위치 검색 서비스에 일시적인 문제가 있습니다.' })
      return
    }

    const data = (await response.json()) as { addresses: NaverGeocodeAddress[] }
    console.log(`[geocode] 결과: ${data.addresses?.length ?? 0}개`)

    if (!data.addresses?.length) {
      res.json({ results: [] })
      return
    }

    const results = data.addresses.slice(0, 5).map(addr => ({
      name: addr.roadAddress || addr.jibunAddress,
      address: addr.roadAddress || addr.jibunAddress,
      coords: { lat: parseFloat(addr.y), lng: parseFloat(addr.x) },
    }))

    res.json({ results })
  } catch (err) {
    console.error('[geocode] 오류:', err)
    res.status(500).json({ message: '위치 검색에 실패했습니다.' })
  }
})

export default router
