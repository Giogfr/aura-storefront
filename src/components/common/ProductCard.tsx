import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  aspectRatio?: 'portrait' | 'square';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = 'portrait',
}) => {
  const {
    navigateTo,
    addToCart,
    isInWishlist,
    toggleWishlist,
    openQuickView,
    formatPrice,
    recentlyAddedId,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors.length > 0 ? product.colors[0].name : ''
  );
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);

  const isSaved = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;
  const isRecentlyAdded = recentlyAddedId === product.id;

  const handleCardClick = () => {
    navigateTo('product', { productId: product.id });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    if (product.sizes && product.sizes.length > 1) {
      openQuickView(product);
    } else {
      addToCart(product, 1, selectedColor);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistAnimate(true);
    setTimeout(() => setWishlistAnimate(false), 450);
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const fallbackImage = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop';

  return (
    <div
      className="group relative flex flex-col cursor-pointer select-none transition-all"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media container */}
      <div
        className={`relative w-full overflow-hidden bg-neutral-100 rounded-sm ${
          aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
        }`}
      >
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            hasSecondaryImage && isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Secondary Image cross-fade */}
        {hasSecondaryImage && (
          <img
            src={product.images[1]}
            alt={`${product.title} alternate view`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {!product.inStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-neutral-900/90 text-white rounded">
              Sold Out
            </span>
          )}
          {product.inStock && product.isSale && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-white rounded shadow-sm">
              {discountPercentage > 0 ? `-${discountPercentage}%` : 'Sale'}
            </span>
          )}
          {product.inStock && product.isNew && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-neutral-900 text-white rounded shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Floating action buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              wishlistAnimate ? 'animate-heart-beat' : ''
            } ${
              isSaved
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 text-neutral-700 hover:bg-white hover:text-neutral-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleQuickViewClick}
            aria-label="Quick view"
            className="w-8 h-8 rounded-full bg-white/90 text-neutral-700 hover:bg-white hover:text-neutral-900 flex items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 hidden sm:flex"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Bar (Desktop) */}
        {product.inStock && (
          <div className="absolute bottom-0 inset-x-0 p-2.5 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hidden sm:block z-10">
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                isRecentlyAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white/95 backdrop-blur text-neutral-900 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              {isRecentlyAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.sizes && product.sizes.length > 1 ? 'Select Options' : 'Quick Add'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-1 flex flex-col flex-grow">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
          <span className="font-medium tracking-wide uppercase text-[10px] text-neutral-400">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-neutral-700 text-[11px]">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-neutral-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title with consistent 2-line height alignment */}
        <h3 className="text-sm font-medium min-h-[2.5rem] mb-1 leading-snug">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="block w-full text-left text-neutral-900 group-hover:text-neutral-600 hover:text-neutral-600 transition-colors line-clamp-2 focus:outline-hidden focus-visible:underline"
          >
            {product.title}
          </button>
        </h3>

        {/* Price & Compare-At */}
        <div className="flex items-center gap-2 mt-auto text-sm">
          <span className="font-semibold text-neutral-900">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          {product.compareAtPrice && discountPercentage > 0 && (
            <span className="text-[11px] text-rose-600 font-medium ml-auto">
              Save {formatPrice(product.compareAtPrice - product.price)}
            </span>
          )}
        </div>

        {/* Color swatches preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 pt-1">
            {product.colors.slice(0, 5).map((color) => (
              <button
                key={color.name}
                type="button"
                title={color.name}
                aria-label={`Select colour ${color.name}`}
                aria-pressed={selectedColor === color.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color.name);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === color.name
                    ? 'ring-1 ring-neutral-900 ring-offset-1 border-transparent scale-110'
                    : 'border-neutral-300 hover:border-neutral-600'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-neutral-400 font-medium">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Mobile Quick Add action button */}
        {product.inStock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="sm:hidden mt-2.5 w-full py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{isRecentlyAdded ? 'Added' : product.sizes && product.sizes.length > 1 ? 'Options' : 'Add to Bag'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
