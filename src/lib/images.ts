import type { SyntheticEvent } from 'react';

/**
 * Neutral placeholder images shown when a remote image fails to load.
 * These are Unsplash demo assets — replace them with your own local assets
 * before production (see the "Assets & licensing" section of the README).
 */
export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop';

export const FALLBACK_COLLECTION_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop';

/**
 * Build an `onError` handler that swaps in a fallback image.
 * It stops after the first swap so a broken fallback can't loop forever.
 */
export const imageFallback =
  (fallback: string) =>
  (event: SyntheticEvent<HTMLImageElement>): void => {
    const image = event.currentTarget;
    if (image.src === fallback) return;
    image.src = fallback;
  };
