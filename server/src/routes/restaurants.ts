import { Router, Request, Response } from 'express'

const router = Router()

const KAKAO_CATEGORY_URL =
  'https://dapi.kakao.com/v2/local/search/category.json'
const KAKAO_IMAGE_URL = 'https://dapi.kakao.com/v2/search/image'

interface KakaoPlace {
  id: string
  place_name: string
  category_name: string
  category_group_code: string
  phone: string
  address_name: string
  road_address_name: string
  x: string // 경도
  y: string // 위도
  distance: string
  place_url: string
  thumbnail_url?: string
}

interface KakaoResponse {
  documents: KakaoPlace[]
  meta: { total_count: number; pageable_count: number; is_end: boolean }
}

async function fetchPlaceImage(name: string): Promise<string | undefined> {
  try {
    const params = new URLSearchParams({ query: name, size: '1' })
    const res = await globalThis.fetch(`${KAKAO_IMAGE_URL}?${params}`, {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
    })
    if (!res.ok) return undefined
    const data = (await res.json()) as {
      documents: Array<{ thumbnail_url: string }>
    }
    return data.documents?.[0]?.thumbnail_url || undefined
  } catch {
    return undefined
  }
}

function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function mapCategory(categoryName: string): string {
  if (categoryName.includes('한식')) return '한식'
  if (
    categoryName.includes('일식') ||
    categoryName.includes('초밥') ||
    categoryName.includes('라멘') ||
    categoryName.includes('돈가스')
  )
    return '일식'
  if (categoryName.includes('중식') || categoryName.includes('중국'))
    return '중식'
  if (
    categoryName.includes('양식') ||
    categoryName.includes('이탈리아') ||
    categoryName.includes('피자') ||
    categoryName.includes('스테이크') ||
    categoryName.includes('패스트푸드') ||
    categoryName.includes('버거')
  )
    return '양식'
  if (
    categoryName.includes('카페') ||
    categoryName.includes('커피') ||
    categoryName.includes('디저트')
  )
    return '카페'
  return '음식점'
}

async function fetchKakaoPage(
  lat: number,
  lng: number,
  radius: number,
  code: string,
  page: number
): Promise<KakaoResponse> {
  const params = new URLSearchParams({
    category_group_code: code,
    x: String(lng),
    y: String(lat),
    radius: String(Math.min(radius, 20000)),
    sort: 'distance',
    page: String(page),
    size: '15',
  })
  const res = await globalThis.fetch(`${KAKAO_CATEGORY_URL}?${params}`, {
    headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
  })
  if (!res.ok) throw new Error(`Kakao API HTTP ${res.status}`)
  return res.json() as Promise<KakaoResponse>
}

async function searchKakao(
  lat: number,
  lng: number,
  radius: number,
  code: string
): Promise<KakaoPlace[]> {
  const results: KakaoPlace[] = []
  for (let page = 1; page <= 3; page++) {
    const data = await fetchKakaoPage(lat, lng, radius, code, page)
    results.push(...data.documents)
    if (data.meta.is_end) break
  }
  return results
}

router.post('/', async (req: Request, res: Response) => {
  const {
    lat,
    lng,
    radius = 300,
    category = '전체',
  } = req.body as {
    lat: number
    lng: number
    radius: number
    category: string
  }

  if (!lat || !lng) {
    res.status(400).json({ message: '좌표가 필요합니다.' })
    return
  }

  if (!process.env.KAKAO_API_KEY) {
    res.status(500).json({ message: 'KAKAO_API_KEY가 설정되지 않았습니다.' })
    return
  }

  console.log(
    `[restaurants] 검색 요청 — lat:${lat}, lng:${lng}, radius:${radius}, category:${category}`
  )

  try {
    const codes = category === '카페' ? ['CE7'] : ['FD6', 'CE7']
    const pages = await Promise.all(
      codes.map(code => searchKakao(lat, lng, radius, code))
    )
    const places = pages.flat()

    // 중복 제거 (id 기준)
    const seen = new Set<string>()
    const unique = places.filter(p => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    })

    console.log(`[restaurants] Kakao 응답 — ${unique.length}개`)

    const mapped = unique.map(p => {
      const rating = 3.0 + (seededRandom(p.id) % 20) / 10
      const reviewCount = seededRandom(p.id + 'r') % 500
      return {
        id: p.id,
        name: p.place_name,
        category: mapCategory(p.category_name),
        address: p.road_address_name || p.address_name,
        coords: { lat: parseFloat(p.y), lng: parseFloat(p.x) },
        distance: parseInt(p.distance, 10),
        phone: p.phone || undefined,
        imageUrl: p.thumbnail_url || undefined,
        naverPlaceUrl: p.place_url || undefined,
        rating: Math.round(rating * 10) / 10,
        reviewCount,
      }
    })

    const filtered =
      category === '전체' || category === '카페'
        ? mapped
        : mapped.filter(r => r.category === category)

    const sorted = filtered.sort((a, b) => a.distance - b.distance)

    console.log(`[restaurants] 최종 결과 — ${sorted.length}개`)

    // 이미지가 없는 상위 20개에 카카오 이미지 검색으로 보강
    const IMAGE_LIMIT = 20
    const toEnrich = sorted.slice(0, IMAGE_LIMIT)
    const rest = sorted.slice(IMAGE_LIMIT)

    const enriched = await Promise.allSettled(
      toEnrich.map(async r => ({
        ...r,
        imageUrl: r.imageUrl ?? (await fetchPlaceImage(r.name)),
      }))
    )

    const finalList = [
      ...enriched
        .map(r => (r.status === 'fulfilled' ? r.value : null))
        .filter(Boolean),
      ...rest,
    ]

    res.json({ restaurants: finalList })
  } catch (err) {
    console.error('[restaurants] 오류:', err)
    res.status(500).json({
      message: '음식점 검색에 실패했습니다. 잠시 후 다시 시도해주세요.',
    })
  }
})

export default router
