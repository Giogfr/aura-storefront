import { describe, expect, it } from 'vitest';
import {
  formatCurrencyAmount,
  getAvailableStock,
  parseRoute,
  resolvePromoCode,
  sanitizeCart,
  sanitizeWishlist,
  TAX_RATE,
} from './storeUtils';
import { productsData } from '../data/products';
import { CurrencyOption } from '../types';

const usd: CurrencyOption = { code: 'USD', symbol: '$', rate: 1, label: 'USD ($)' };
const eur: CurrencyOption = { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' };

const inStockProduct = productsData.find((p) => p.inStock && p.inventoryCount > 0)!;
const soldOutProduct = productsData.find((p) => !p.inStock || p.inventoryCount === 0)!;

describe('resolvePromoCode', () => {
  it('accepts known codes regardless of case and whitespace', () => {
    expect(resolvePromoCode('  welcome10 ').rate).toBeCloseTo(0.1);
    expect(resolvePromoCode('SAVE20').rate).toBeCloseTo(0.2);
    expect(resolvePromoCode('save20').success).toBe(true);
  });

  it('treats FREESHIP as a valid 0% discount', () => {
    const result = resolvePromoCode('freeship');
    expect(result.success).toBe(true);
    expect(result.code).toBe('FREESHIP');
    expect(result.rate).toBe(0);
  });

  it('rejects unknown codes', () => {
    const result = resolvePromoCode('NOPE');
    expect(result.success).toBe(false);
    expect(result.rate).toBe(0);
  });
});

describe('formatCurrencyAmount', () => {
  it('converts using the active rate and always shows two decimals', () => {
    expect(formatCurrencyAmount(100, usd)).toBe('$100.00');
    expect(formatCurrencyAmount(100, eur)).toBe('€92.00');
  });

  it('rounds to the nearest cent', () => {
    expect(formatCurrencyAmount(19.999, usd)).toBe('$20.00');
  });
});

describe('parseRoute', () => {
  it('reads the page and all params from a query string', () => {
    const { page, params } = parseRoute('?page=product&id=prod-1&cat=apparel&q=linen&filter=sale');
    expect(page).toBe('product');
    expect(params).toEqual({
      productId: 'prod-1',
      categoryId: 'apparel',
      searchQuery: 'linen',
      curationFilter: 'sale',
    });
  });

  it('falls back to home and drops unknown values', () => {
    const { page, params } = parseRoute('?page=not-a-page&filter=bogus');
    expect(page).toBe('home');
    expect(params.curationFilter).toBeUndefined();
  });

  it('returns home with no params for an empty query', () => {
    const { page, params } = parseRoute('');
    expect(page).toBe('home');
    expect(params.productId).toBeUndefined();
  });
});

describe('getAvailableStock', () => {
  it('returns zero for sold-out products', () => {
    expect(getAvailableStock(soldOutProduct)).toBe(0);
  });

  it('returns the inventory count for in-stock products', () => {
    expect(getAvailableStock(inStockProduct)).toBe(inStockProduct.inventoryCount);
  });

  it('treats a concurrent out-of-stock flag as zero even with inventory left', () => {
    expect(getAvailableStock({ ...inStockProduct, inStock: false, inventoryCount: 5 })).toBe(0);
  });
});

describe('sanitizeCart', () => {
  it('returns an empty array for non-array input', () => {
    expect(sanitizeCart(null)).toEqual([]);
    expect(sanitizeCart({})).toEqual([]);
    expect(sanitizeCart('nope')).toEqual([]);
  });

  it('drops malformed entries and unknown products', () => {
    const result = sanitizeCart([
      { id: 'a', productId: inStockProduct.id, quantity: 1 },
      { id: 'b', productId: 'does-not-exist', quantity: 1 },
      { id: 'c', quantity: 1 },
      null,
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].productId).toBe(inStockProduct.id);
  });

  it('drops sold-out products', () => {
    const result = sanitizeCart([{ id: 'x', productId: soldOutProduct.id, quantity: 1 }]);
    expect(result).toEqual([]);
  });

  it('clamps restored quantities to the available stock', () => {
    const result = sanitizeCart([
      { id: 'a', productId: inStockProduct.id, quantity: 9999 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(inStockProduct.inventoryCount);
    expect(result[0].maxStock).toBe(inStockProduct.inventoryCount);
  });

  it('drops zero, negative, and non-numeric quantities', () => {
    const result = sanitizeCart([
      { id: 'a', productId: inStockProduct.id, quantity: 0 },
      { id: 'b', productId: inStockProduct.id, quantity: -3 },
      { id: 'c', productId: inStockProduct.id, quantity: 'many' },
    ]);
    expect(result).toEqual([]);
  });
});

describe('sanitizeWishlist', () => {
  it('keeps only known product ids and de-duplicates', () => {
    const result = sanitizeWishlist([inStockProduct.id, inStockProduct.id, 'ghost']);
    expect(result).toEqual([inStockProduct.id]);
  });

  it('returns an empty array for non-array input', () => {
    expect(sanitizeWishlist(undefined)).toEqual([]);
  });
});

describe('TAX_RATE', () => {
  it('is a stable documented demo value', () => {
    expect(TAX_RATE).toBe(0.08);
  });
});
