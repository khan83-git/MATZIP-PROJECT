export interface LatLng {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  coords: LatLng;
  distance: number;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  naverPlaceUrl?: string;
}

export type MoodType = 'hoesik' | 'date' | 'business' | 'family' | 'friends';

export interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  description: string;
}

export interface CurationResult {
  restaurantId: string;
  rank: number;
  summary: string;
  comment: string;
  tags: string[];
}

export interface CurationResponse {
  recommendations: CurationResult[];
  overallComment: string;
}

export interface SearchFilters {
  category: string;
  sortBy: 'distance' | 'rating' | 'reviewCount';
  radius: number;
}

export type RadiusOption = 50 | 100 | 300 | 500 | 1000;
