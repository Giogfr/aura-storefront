import { CartItem, CurrencyOption, PageType, Product, RouteParams } from '../types';
import { productsData } from '../data/products';

/**
 * Demo tax rate applied to the discounted merchandise subtotal.
 * This is a simplified, fixed rule for the template and is documented in the README.
 */
export const TAX_RATE = 0.08;

/**
 * Promo codes supported by the demo checkout. `FREESHIP` has a 0% discount rate
 * but waives the standard shipping fee (handled in the context).
 */
export const PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.1,
  SAVE20: 0.2,
  FREESHIP: 0,
};

export interface PromoResult {
  success: boolean;
  code: string;
  rate: number;
  message: string;
}

/** Resolve a raw promo-code string into a normalized discount result. */
export const resolvePromoCode = (code: string): PromoResult => {
  const clean = code.trim().toUpperCase();
  if (clean in PROMO_CODES) {
    const rate = PROMO_CODES[clean];
    const message =
      clean === 'FREESHIP'
        ? 'Free shipping voucher applied!'
        : `${Math.round(rate * 100)}% discount applied to your order!`;
    return { success: true, code: clean, rate, message };
  }
  return {
    success: false,
    code: '',
    rate: 0,
    message: 'Invalid promo code. Try "WELCOME10", "SAVE20", or "FREESHIP".',
  };
};

/** Convert and format an amount using the active (sample) currency rate. */
export const formatCurrencyAmount = (amount: number, currency: CurrencyOption): string =>
  `${currency.symbol}${(amount * currency.rate).toFixed(2)}`;

const PAGE_TYPES: PageType[] = [
  'home',
  'shop',
  'collections',
  'product',
  'search',
  'cart',
  'checkout',
  'about',
  'contact',
  'faq',
  'shipping-returns',
  'privacy-policy',
  'terms',
];

const CURATION_FILTERS: string[] = ['sale', 'new', 'bestseller'];

/** Parse a URL query string into a validated page + route params. */
export const parseRoute = (search: string): { page: PageType; params: RouteParams } => {
  const params = new URLSearchParams(search);
  const rawPage = params.get('page');
  const page = PAGE_TYPES.includes(rawPage as PageType) ? (rawPage as PageType) : 'home';
  const rawFilter = params.get('filter');

  return {
    page,
    params: {
      productId: params.get('id') || undefined,
      categoryId: params.get('cat') || undefined,
      searchQuery: params.get('q') || undefined,
      curationFilter: rawFilter && CURATION_FILTERS.includes(rawFilter)
        ? (rawFilter as RouteParams['curationFilter'])
        : undefined,
    },
  };
};

/**
 * Authoritative available stock for a product. A missing/zero inventory or an
 * out-of-stock flag both mean "not purchasable" — they are never treated as unlimited.
 */
export const getAvailableStock = (product: Product): number => {
  if (!product.inStock) return 0;
  if (!Number.isFinite(product.inventoryCount)) return 0;
  return Math.max(0, Math.floor(product.inventoryCount));
};

/** Rebuild a single stored cart entry against the current catalog, or drop it. */
const rebuildCartItem = (raw: unknown): CartItem | null => {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Partial<CartItem>;
  if (typeof item.id !== 'string' || typeof item.productId !== 'string') return null;

  const product = productsData.find((p) => p.id === item.productId);
  if (!product) return null;

  const available = getAvailableStock(product);
  if (available <= 0) return null;

  const quantity = item.quantity;
  if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0) return null;

  return {
    id: item.id,
    productId: product.id,
    title: product.title,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    image: product.images[0],
    selectedColor: typeof item.selectedColor === 'string' ? item.selectedColor : undefined,
    selectedSize: typeof item.selectedSize === 'string' ? item.selectedSize : undefined,
    quantity: Math.min(Math.floor(quantity), available),
    maxStock: available,
    product,
  };
};

/**
 * Validate untrusted (localStorage) cart data: reject malformed entries, drop
 * products that no longer exist or are sold out, and clamp quantities to stock.
 */
export const sanitizeCart = (value: unknown): CartItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map(rebuildCartItem)
    .filter((item): item is CartItem => item !== null);
};

/** Validate untrusted wishlist data: keep only known product ids, de-duplicated. */
export const sanitizeWishlist = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const known = new Set(productsData.map((p) => p.id));
  const seen = new Set<string>();
  const result: string[] = [];
  for (const entry of value) {
    if (typeof entry === 'string' && known.has(entry) && !seen.has(entry)) {
      seen.add(entry);
      result.push(entry);
    }
  }
  return result;
};
