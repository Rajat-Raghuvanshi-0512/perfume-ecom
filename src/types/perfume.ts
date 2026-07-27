export type FragranceFamily =
  | 'Woody & Warm'
  | 'Oriental & Amber'
  | 'Floral & Botanical'
  | 'Fresh & Citrus'
  | 'Gourmand & Sweet'
  | 'Leather & Smoked';

export type Concentration =
  | 'Extrait de Parfum (30%)'
  | 'Eau de Parfum (20%)'
  | 'Eau de Toilette (15%)'
  | 'Pure Perfume Oil';

export interface ScentNote {
  name: string;
  category: 'Top' | 'Heart' | 'Base';
  description: string;
  iconName?: string;
}

export interface FragrancePyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export interface PerfumeReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Perfume {
  id: string;
  name: string;
  subtitle: string;
  brand: string;
  price: number; // base price for 50ml
  volumes: { ml: number; price: number }[];
  rating: number;
  reviewsCount: number;
  family: FragranceFamily;
  concentration: Concentration;
  description: string;
  story: string;
  images: string[];
  pyramid: FragrancePyramid;
  longevity: '6-8 Hours' | '8-12 Hours' | '12-16 Hours' | 'Eternal (18+ Hrs)';
  sillage: 'Intimate' | 'Moderate' | 'Heavy' | 'Enormous';
  season: ('Spring' | 'Summer' | 'Autumn' | 'Winter')[];
  vibe: string[];
  isBestseller?: boolean;
  isNewRelease?: boolean;
  isLimitedEdition?: boolean;
  inStock: boolean;
  stockCount: number;
}

export interface CartItem {
  perfume: Perfume;
  selectedMl: number;
  price: number;
  quantity: number;
  sampleVialAdded?: boolean;
}
