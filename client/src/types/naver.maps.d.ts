declare namespace naver {
  namespace maps {
    class Map {
      constructor(element: string | HTMLElement, options?: MapOptions)
      setCenter(coord: Coord): void
      setZoom(zoom: number): void
      getCenter(): LatLng
      getZoom(): number
      destroy(): void
      panTo(coord: Coord): void
      fitBounds(bounds: LatLngBounds, margin?: { top?: number; right?: number; bottom?: number; left?: number }): void
    }

    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
      equals(other: LatLng): boolean
    }

    class LatLngBounds {
      constructor(sw: LatLng, ne: LatLng)
      extend(latlng: LatLng): void
    }

    class Marker {
      constructor(options?: MarkerOptions)
      setMap(map: Map | null): void
      setPosition(coord: Coord): void
      getPosition(): LatLng
      setIcon(icon: MarkerIcon | string): void
      setZIndex(zIndex: number): void
    }

    class Circle {
      constructor(options?: CircleOptions)
      setMap(map: Map | null): void
      setCenter(coord: Coord): void
      setRadius(radius: number): void
    }

    class InfoWindow {
      constructor(options?: InfoWindowOptions)
      open(map: Map, anchor: Marker | Coord): void
      close(): void
      setContent(content: string | HTMLElement): void
    }

    namespace Event {
      function addListener(target: object, type: string, listener: (...args: unknown[]) => void): void
      function removeListener(target: object, type: string, listener: (...args: unknown[]) => void): void
    }

    namespace Service {
      function geocode(options: GeocodeOptions, callback: (status: ServiceStatus, response: GeocodeResponse) => void): void
      function reverseGeocode(options: ReverseGeocodeOptions, callback: (status: ServiceStatus, response: ReverseGeocodeResponse) => void): void

      const Status: {
        OK: ServiceStatus
        ERROR: ServiceStatus
        ZERO_RESULTS: ServiceStatus
      }

      type ServiceStatus = 'OK' | 'ERROR' | 'ZERO_RESULTS'
    }

    namespace Place {
      function searchPlaces(query: string, callback: (status: PlaceSearchStatus, result: PlaceSearchResult) => void, options?: PlaceSearchOptions): void
      function nearbySearch(options: NearbySearchOptions, callback: (status: PlaceSearchStatus, result: PlaceSearchResult) => void): void

      type PlaceSearchStatus = 'OK' | 'ERROR' | 'ZERO_RESULTS'
    }

    type Coord = LatLng

    interface MapOptions {
      center?: Coord
      zoom?: number
      minZoom?: number
      maxZoom?: number
      mapTypeId?: string
      zoomControl?: boolean
      zoomControlOptions?: { position: Position }
    }

    interface MarkerOptions {
      position?: Coord
      map?: Map
      icon?: MarkerIcon | string
      title?: string
      zIndex?: number
      clickable?: boolean
    }

    interface MarkerIcon {
      url?: string
      content?: string | HTMLElement
      size?: Size
      anchor?: Point
    }

    interface CircleOptions {
      map?: Map
      center?: Coord
      radius?: number
      strokeColor?: string
      strokeOpacity?: number
      strokeWeight?: number
      fillColor?: string
      fillOpacity?: number
    }

    interface InfoWindowOptions {
      content?: string | HTMLElement
      maxWidth?: number
      backgroundColor?: string
      borderWidth?: number
      borderColor?: string
    }

    interface GeocodeOptions {
      query?: string
      coordinate?: string
    }

    interface GeocodeResponse {
      v2: {
        addresses: Array<{
          x: string
          y: string
          roadAddress: string
          jibunAddress: string
        }>
      }
    }

    interface ReverseGeocodeOptions {
      coords: Coord
      orders?: string[]
    }

    interface ReverseGeocodeResponse {
      v2: {
        address: {
          roadAddress: string
          jibunAddress: string
        }
      }
    }

    interface PlaceSearchOptions {
      coordinate?: string
      radius?: number
      bounds?: string
      start?: number
      display?: number
    }

    interface NearbySearchOptions {
      coords: Coord
      radius?: number
      category?: string
      start?: number
      display?: number
    }

    interface PlaceSearchResult {
      items: PlaceItem[]
      total: number
      start: number
      display: number
    }

    interface PlaceItem {
      id: string
      name: string
      category: string
      address: string
      roadAddress: string
      x: string
      y: string
      phone: string
      distance: string
      reviewCount: number
      bookingReviewScore: string
      naverBookingUrl: string
    }

    class Size {
      constructor(width: number, height: number)
    }

    class Point {
      constructor(x: number, y: number)
    }

    type Position = number

    const Position: {
      TOP_RIGHT: Position
      TOP_LEFT: Position
      BOTTOM_RIGHT: Position
      BOTTOM_LEFT: Position
    }
  }
}
