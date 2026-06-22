# 🗺️ 맛ZIP 개발 로드맵

> 현재 위치 기반 AI 맛집 큐레이션 모바일 웹 서비스

---

## 📌 프로젝트 개요

| 항목        | 내용                                                     |
| ----------- | -------------------------------------------------------- |
| 프로젝트명  | 맛ZIP (맛집 + ZIP/검색)                                  |
| 타겟 플랫폼 | 모바일 웹 브라우저                                       |
| 핵심 가치   | 위치 기반 맛집 탐색 + AI 큐레이션으로 빠른 의사결정 지원 |

---

## 🛠️ 최종 기술 스택

### 프론트엔드

| 구분          | 기술                  | 버전   | 선택 이유                 |
| ------------- | --------------------- | ------ | ------------------------- |
| 번들러        | Vite                  | 6.x    | 빠른 HMR, 간결한 설정     |
| UI 라이브러리 | React                 | 19.x   | 최신 동시성 기능          |
| 언어          | TypeScript            | 5.x    | 타입 안전성               |
| 스타일링      | TailwindCSS           | 4.x    | 모바일 퍼스트 유틸리티    |
| 라우팅        | React Router          | 7.x    | SPA 라우팅                |
| 상태관리      | Zustand               | 5.x    | 경량, 보일러플레이트 최소 |
| 서버 상태     | TanStack Query        | 5.x    | 캐싱, 로딩/에러 처리      |
| HTTP          | Axios                 | 1.x    | 인터셉터, 에러 핸들링     |
| 아이콘        | Lucide React          | latest | 일관된 디자인 시스템      |
| 폼            | React Hook Form + Zod | latest | 성능 최적화된 폼 검증     |

### 백엔드 (프록시 서버)

| 구분   | 기술                                | 선택 이유                        |
| ------ | ----------------------------------- | -------------------------------- |
| 런타임 | Node.js + Express                   | Claude API 키 보호용 경량 프록시 |
| AI     | Anthropic SDK (`@anthropic-ai/sdk`) | Claude API 연동                  |

### 외부 API

| 구분        | API                            |
| ----------- | ------------------------------ |
| 지도 렌더링 | 네이버 지도 JavaScript API v3  |
| 장소 검색   | 네이버 지도 Places API         |
| AI 큐레이션 | Claude API (claude-sonnet-4-6) |

---

## 📐 폴더 구조

```
matzip-project/
├── client/                     # React + Vite 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── api/               # API 호출 함수 (Axios)
│   │   ├── components/        # 재사용 컴포넌트
│   │   │   ├── common/        # Button, Input, Card, Modal 등
│   │   │   ├── layout/        # Layout, BottomNav, Header
│   │   │   ├── map/           # NaverMap, Marker, RadiusCircle
│   │   │   ├── restaurant/    # RestaurantCard, RestaurantList
│   │   │   └── ai/            # CurationCard, CurationModal
│   │   ├── hooks/             # 커스텀 훅
│   │   ├── pages/             # 라우트별 페이지 컴포넌트
│   │   ├── store/             # Zustand 스토어
│   │   ├── types/             # TypeScript 인터페이스
│   │   ├── utils/             # 유틸리티 함수
│   │   └── lib/               # 라이브러리 설정 (axios, queryClient)
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Express 프록시 서버
│   ├── src/
│   │   ├── routes/            # API 라우트
│   │   └── index.ts           # 서버 진입점
│   └── package.json
│
└── docs/                       # 프로젝트 문서
    └── ROADMAP.md
```

---

## 🚀 Phase별 개발 계획

---

### Phase 0: 프로젝트 초기 설정

> **목표**: 개발 환경 구성 및 프로젝트 뼈대 구축
> **예상 기간**: 1일

#### 작업 목록

- [x] **0-1. 클라이언트 프로젝트 초기화**
  - `npm create vite@latest client -- --template react-ts`
  - TailwindCSS v4 설치 및 설정
  - 절대 경로 별칭 설정 (`@/` → `src/`)

- [x] **0-2. 의존성 설치**

  ```bash
  # 프론트엔드 핵심
  npm install react-router-dom@7 zustand @tanstack/react-query axios
  npm install react-hook-form zod @hookform/resolvers
  npm install lucide-react

  # 개발 도구
  npm install -D eslint prettier eslint-config-prettier
  ```

- [x] **0-3. 서버 프로젝트 초기화**

  ```bash
  mkdir server && cd server
  npm init -y
  npm install express cors dotenv @anthropic-ai/sdk
  npm install -D typescript ts-node @types/express @types/node nodemon
  ```

- [x] **0-4. 환경변수 설정**

  ```env
  # client/.env
  VITE_NAVER_CLIENT_ID=
  VITE_API_BASE_URL=http://localhost:3001

  # server/.env
  ANTHROPIC_API_KEY=
  NAVER_CLIENT_ID=
  NAVER_CLIENT_SECRET=
  PORT=3001
  ```

- [x] **0-5. 폴더 구조 생성 및 기본 라우팅 설정**
  - React Router v7 라우터 설정 (`/`, `/search`, `/restaurant/:id`, `/curation`)
  - TanStack Query Provider, Zustand 스토어 초기화
  - Axios 인스턴스 및 기본 인터셉터 설정

#### 완료 기준

- `npm run dev` 실행 시 Vite 개발 서버 정상 동작
- `npm run dev` 실행 시 Express 서버 정상 동작
- 기본 라우팅 (`/`, `/search`) 페이지 전환 확인

---

### Phase 1: 기본 UI/UX 레이아웃

> **목표**: 모바일 퍼스트 기반 공통 레이아웃 및 화면 뼈대 구성
> **예상 기간**: 2일

#### 작업 목록

- [x] **1-1. 모바일 레이아웃 컴포넌트**
  - `AppLayout`: 최대 너비 430px 고정, 전체 높이 채우기
  - `Header`: 상단 앱바 (뒤로가기, 타이틀, 액션 버튼)
  - `BottomNav`: 하단 탭 네비게이션 (홈, 검색, 즐겨찾기)

- [x] **1-2. 공통 UI 컴포넌트**
  - `Button`: 기본/아웃라인/텍스트 변형, 로딩 상태
  - `SearchInput`: 검색 입력, 지우기 버튼
  - `RestaurantCard`: 맛집 정보 카드 (거리, 평점, 즐겨찾기)
  - `Badge`: 업종 태그, 거리 표시
  - `BottomSheet`: 필터/상세 정보용 슬라이드 업 모달
  - `Skeleton` / `RestaurantCardSkeleton`: 로딩 상태
  - `EmptyState`: 검색 결과 없음 상태
  - `MoodChipList`: 모임 성격 선택 칩

- [x] **1-3. 홈 화면 (`/`)**
  - 오렌지 그라디언트 히어로 + 앱 소개
  - "현재 위치로 검색" CTA 버튼 (Geolocation 연동)
  - 장소 텍스트 검색 입력 필드
  - 모임 성격 빠른 선택 칩 (회식, 데이트, 비즈니스, 가족, 친구)

- [x] **1-4. 검색 결과 화면 (`/search`)**
  - 상단 검색바 (위치 텍스트 표시)
  - 반경 선택 칩 (50m / 100m / 300m / 500m / 1km)
  - 업종 필터 바 + 정렬 드롭다운
  - 맛집 카드 리스트 (로딩/빈 상태 처리)
  - 지도 보기 / 목록 보기 토글 버튼

- [x] **1-5. 맛집 상세 화면 (`/restaurant/:id`)**
  - 맛집 이름, 업종 뱃지, 평점, 거리
  - 주소, 전화번호
  - 네이버 지도 이동 링크 + AI 추천 버튼
  - 즐겨찾기 하트 버튼

- [x] **1-6. AI 큐레이션 화면 (`/curation`)**
  - 모임 성격 선택 그리드 카드 UI
  - SSE 스트리밍 텍스트 실시간 표시
  - 추천 결과 카드 (순위, 코멘트, 태그)
  - 전체 큐레이션 배너 + 다시 추천받기 버튼

#### 완료 기준

- 모든 화면 Figma 없이 모바일(375px) 기준 정상 렌더링
- BottomNav로 화면 간 이동 동작
- 다크/라이트 배경색 구분된 카드 레이아웃

---

### Phase 2: 네이버 지도 API 연동

> **목표**: 지도 렌더링 및 현재 위치 기반 탐색 기능 구현
> **예상 기간**: 2~3일

#### 사전 준비

- 네이버 클라우드 플랫폼 앱 등록 (Web Service URL 설정)
- Application Client ID 발급
- Maps, Places API 사용 설정

#### 작업 목록

- [x] **2-1. 네이버 지도 스크립트 로드**
  - `index.html`에 `%VITE_NAVER_CLIENT_ID%` 환경변수로 스크립트 삽입
  - `naver.maps.d.ts` TypeScript 타입 선언 (Phase 0에서 완성)

- [x] **2-2. `NaverMap` 컴포넌트 구현**
  - `forwardRef` + `NaverMapHandle` 노출 (`getMap`, `panTo`)
  - 지도 스크립트 로드 대기 후 초기화 (100ms 폴링)
  - 컴포넌트 언마운트 시 `map.destroy()` 호출

- [x] **2-3. 현재 위치 기능**
  - `useCurrentLocation` 훅: `{ coords, isLoading, error, requestLocation }`
  - `CurrentLocationMarker`: 파란 점 + 펄스 애니메이션 HTML 마커

- [x] **2-4. 반경 원 시각화**
  - `RadiusCircle`: 오렌지 반투명 원 오버레이
  - 반경/중심 변경 시 즉시 업데이트

- [x] **2-5. 맛집 마커 표시**
  - `RestaurantMarkers`: 업종별 이모지 커스텀 마커
  - 선택된 마커 강조(오렌지 배경, 1.2× 크기)
  - 마커 클릭 시 `BottomSheet`로 간략 정보 표시

- [x] **2-6. 지도 ↔ 목록 동기화**
  - 목록 카드 클릭 → `selectedRestaurant` 스토어 업데이트 → 마커 하이라이트
  - 마커 클릭 → `BottomSheet` + `panTo`로 지도 이동
  - `MapView` 통합 컴포넌트로 SearchPage에서 지도/목록 토글

- [x] **2-7. Zustand 위치 스토어** (Phase 0에서 구현 완료)

#### 완료 기준

- 지도가 정상 렌더링되고 현재 위치 마커 표시
- 반경 변경 시 원 오버레이 실시간 업데이트
- 목록 ↔ 지도 마커 연동 동작

---

### Phase 3: 맛집 검색 기능 구현

> **목표**: 현재 위치/특정 위치 기반 맛집 검색 및 결과 표시
> **예상 기간**: 3일

#### 작업 목록

- [x] **3-1. 장소 텍스트 검색 (특정 위치 기준)**
  - 네이버 Geocoding REST API (서버 프록시) 연동
  - `LocationSearchInput`: 자동완성 드롭다운 (디바운스 350ms)
  - 선택한 장소 → 중심 좌표 설정 → `/search` 이동
  - 최근 검색어 localStorage 저장

- [x] **3-2. 반경 내 맛집 데이터 수집**
  - OpenStreetMap Overpass API (무료, 키 불필요) 서버에서 호출
  - 중심 좌표 + 반경(around) + amenity 필터 쿼리
  - Haversine 공식으로 거리 계산 후 정렬
  - 수집 데이터 정규화:
    ```ts
    interface Restaurant {
      id: string
      name: string
      category: string // 업종 (한식, 중식 등)
      address: string
      coords: LatLng
      distance: number // 미터
      phone?: string
      rating?: number
      reviewCount?: number
      naverPlaceUrl?: string
    }
    ```

- [x] **3-3. 필터 및 정렬**
  - 업종 필터 (전체 / 한식 / 중식 / 일식 / 양식 / 카페 / 기타)
  - 정렬: 거리순(기본) / 평점순 / 리뷰수순 (클라이언트 정렬)
  - 필터 상태 Zustand 스토어 관리

- [x] **3-4. TanStack Query 연동**
  - `useRestaurantSearch(coords, radius, category)` 커스텀 훅
  - 결과 자동으로 Zustand 스토어에 동기화 (지도 마커 연동)
  - staleTime: 5분

- [x] **3-5. 무한 스크롤** — Overpass API 단일 응답 방식으로 대체 (페이지네이션 불필요)

- [x] **3-6. 검색 결과 상태 처리**
  - 로딩: 스켈레톤 카드 5개
  - 에러: 재시도 버튼
  - 좌표 미설정: 홈으로 안내
  - 빈 결과: 반경 넓히기 버튼

- [x] **3-7. Zustand 검색 스토어** (Phase 0에서 구현 완료)
  ```ts
  interface SearchStore {
    restaurants: Restaurant[]
    selectedRestaurant: Restaurant | null
    filters: SearchFilters
    recentSearches: string[]
    setRestaurants: (data: Restaurant[]) => void
    setSelectedRestaurant: (r: Restaurant | null) => void
    setFilters: (filters: Partial<SearchFilters>) => void
    addRecentSearch: (keyword: string) => void
  }
  ```

#### 완료 기준

- 현재 위치 버튼 → 반경 내 맛집 목록 + 지도 마커 표시
- 텍스트 검색 → 장소 선택 → 해당 위치 기준 맛집 탐색
- 필터/정렬 변경 시 목록 실시간 업데이트

---

### Phase 4: AI 기반 맛집 큐레이션

> **목표**: 맛집 데이터를 Claude API에 전달하여 모임 성격별 AI 추천 생성
> **예상 기간**: 2~3일

#### 작업 목록

- [x] **4-1. Express 프록시 서버 구현**
  - `POST /api/curate` 엔드포인트
  - 요청 바디: `{ restaurants: Restaurant[], moodType: MoodType }`
  - Claude API 호출 후 응답 반환
  - CORS 설정 (클라이언트 origin 허용)
  - 에러 핸들링 (API 한도 초과, 타임아웃)

- [x] **4-2. 모임 성격 정의**

  ```ts
  type MoodType =
    | 'hoesik' // 회식 (넓은 공간, 단체 가능, 가성비)
    | 'date' // 데이트 (분위기, 인테리어, 조용함)
    | 'business' // 비즈니스 (프라이빗 룸, 주차, 격식)
    | 'family' // 가족 모임 (아이 친화, 넓은 좌석)
    | 'friends' // 친구 모임 (가성비, 활기, 다양한 메뉴)
  ```

- [x] **4-3. Claude API 프롬프트 설계**

  ```
  시스템: 당신은 맛집 전문 큐레이터입니다. 주어진 맛집 목록과 모임 성격을 분석하여
         최적의 맛집을 추천하고 각 맛집에 대한 맞춤 추천 코멘트를 작성합니다.

  사용자:
  - 모임 성격: {moodType}
  - 후보 맛집 목록: {restaurants JSON}

  응답 형식 (JSON):
  {
    "recommendations": [
      {
        "restaurantId": "string",
        "rank": 1,
        "summary": "한 줄 요약 (20자 이내)",
        "comment": "추천 이유 (100자 이내)",
        "tags": ["분위기 좋음", "단체 가능"]
      }
    ],
    "overallComment": "전체 큐레이션 요약 멘트 (50자 이내)"
  }
  ```

- [x] **4-4. Streaming 응답 처리**
  - Claude API streaming 활성화
  - 서버에서 SSE (Server-Sent Events) 로 클라이언트에 전달
  - 클라이언트에서 타이핑 애니메이션 효과로 텍스트 표시

- [x] **4-5. 큐레이션 UI 구현**
  - 모임 성격 선택 카드 (이모지 + 레이블 + 설명)
  - "AI 추천 받기" 버튼 → 로딩 스피너
  - 추천 결과 카드:
    - 순위 뱃지 (1st, 2nd, 3rd, #4, #5)
    - 맛집 이름 + AI 한 줄 요약
    - AI 추천 코멘트
    - 태그 칩 목록
  - 전체 큐레이션 코멘트 배너
  - "다시 추천받기" 버튼
  - 에러 상태 표시 (AlertCircle)

- [x] **4-6. 커스텀 훅 분리**
  - `client/src/api/curation.ts`: SSE fetch 함수 (`streamCuration`)
  - `client/src/hooks/useCuration.ts`: 스트리밍 상태 관리 훅
  - AbortController로 중복 요청 취소 처리
  - 모임 성격 선택 시 Zustand 스토어에 동기화

#### 완료 기준

- 모임 성격 선택 → AI 추천 결과 3~5곳 표시
- 각 맛집에 AI 생성 코멘트 및 태그 표시
- 스트리밍으로 텍스트가 순차적으로 나타나는 효과

---

### Phase 5: 고도화 및 UX 개선

> **목표**: 사용성 개선, 엣지 케이스 처리, PWA 적용
> **예상 기간**: 2일

#### 작업 목록

- [ ] **5-1. 즐겨찾기 기능**
  - 하트 버튼으로 맛집 즐겨찾기 토글
  - localStorage 영속화
  - 즐겨찾기 탭 화면 구현

- [ ] **5-2. 검색 반경 슬라이더**
  - 드래그 슬라이더로 50m ~ 2km 연속 조절
  - 슬라이더 이동 시 지도 원 오버레이 실시간 업데이트

- [ ] **5-3. UX 개선**
  - Pull-to-refresh (목록 당겨서 새로고침)
  - 스크롤 상단 이동 FAB 버튼
  - 검색 중 지도 영역 축소 / 결과 목록 확장 트랜지션
  - 로딩 스켈레톤 shimmer 애니메이션

- [ ] **5-4. 에러 처리 강화**
  - 네트워크 오프라인 감지 + 배너 표시
  - API 에러 코드별 사용자 메시지 (위치 권한 거부, API 한도 초과)
  - 전역 에러 바운더리 (`ErrorBoundary` 컴포넌트)

- [ ] **5-5. 접근성 및 성능**
  - 시맨틱 HTML (landmark roles, aria-label)
  - 이미지 lazy loading
  - React.memo / useMemo 최적화 포인트 점검
  - Lighthouse 모바일 점수 80점 이상 목표

- [ ] **5-6. PWA 설정**
  - `vite-plugin-pwa` 적용
  - Web App Manifest (홈 화면 추가 지원)
  - Service Worker (정적 자산 캐싱)

#### 완료 기준

- 즐겨찾기 추가/제거 후 앱 재시작 시에도 유지
- 오프라인 상태에서 안내 메시지 정상 표시
- Lighthouse 모바일 성능 80점 이상

---

## 📊 전체 일정 요약

```
Week 1
├── Day 1     : Phase 0 - 환경 설정
├── Day 2~3   : Phase 1 - UI 레이아웃
└── Day 4~6   : Phase 2 - 네이버 지도 연동

Week 2
├── Day 7~9   : Phase 3 - 맛집 검색 기능
├── Day 10~12 : Phase 4 - AI 큐레이션
└── Day 13~14 : Phase 5 - 고도화 및 QA
```

---

## 🔑 API 키 발급 체크리스트

- [ ] 네이버 클라우드 플랫폼 가입 → Application 등록
  - Maps, Places API 활성화
  - Web Service URL 등록 (`http://localhost:5173`)
- [ ] Anthropic Console 가입 → API Key 발급
  - 사용 한도 설정 (개발 중 과금 방지)

---

## ⚠️ 주요 제약 및 고려 사항

| 항목              | 내용                                                           |
| ----------------- | -------------------------------------------------------------- |
| API 보안          | Claude API 키는 서버(Express)에서만 사용, 클라이언트 노출 금지 |
| 네이버 Places API | 무료 티어 일일 호출 한도 확인 필요                             |
| Geolocation       | HTTPS 환경에서만 동작 (로컬 개발은 localhost 예외 적용)        |
| 모바일 최적화     | 지도 터치 이벤트, pinch-to-zoom 충돌 방지 처리 필요            |
| AI 응답 시간      | Claude API 응답 평균 3~8초 → 로딩 UX 필수                      |
