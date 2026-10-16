export type PageType =
  | 'home'
  | 'shop'
  | 'collections'
  | 'product'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping-returns'
  | 'privacy-policy'
  | 'terms';

export interface RouteParams {
  productId?: string;
  categoryId?: string;
  searchQuery?: string;
  curationFilter?: 'sale' | 'new' | 'bestseller';
}

export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface ProductSize {
  label: string;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  isSale?: boolean;
  isNew?: boolean;
  inStock: boolean;
  inventoryCount: number;
  category: string; // e.g. 'apparel', 'footwear', 'accessories', 'home', 'tech', 'wellness'
  categoryName: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes?: ProductSize[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  materials: string;
  careInstructions: string;
  shippingInfo: string;
  reviews: ProductReview[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  featured?: boolean;
}

export interface CartItem {
  id: string; // generated unique id (product.id + color + size)
  productId: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  maxStock: number;
  product?: Product;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  rate: number;
  label: string;
}

export interface StoreConfig {
  storeName: string;
  storeTagline: string;
  announcementBar: {
    enabled: boolean;
    messages: string[];
  };
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socials: {
    instagram: string;
    twitter: string;
    pinterest: string;
    facebook: string;
    tiktok: string;
  };
}
