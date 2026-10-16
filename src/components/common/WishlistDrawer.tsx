import React from 'react';
import { useStore } from '../../context/StoreContext';
import { productsData } from '../../data/products';
import { Product } from '../../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    navigateTo,
    formatPrice,
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = wishlist
    .map((id) => productsData.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleAddAllToCart = () => {
    savedProducts.forEach((p) => {
      if (p && p.inStock) {
        addToCart(p, 1);
      }
    });
    setIsWishlistOpen(false);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="text-base font-bold text-neutral-900">Saved Items</h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full">
              {wishlist.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs mb-6 leading-relaxed">
                Tap the heart icon on any piece you admire to curate your personal wardrobe wishlist.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsWishlistOpen(false);
                  navigateTo('shop');
                }}
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {savedProducts.map((product) => {
                return (
                  <div key={product.id} className="py-3.5 flex gap-3.5 items-center">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                      className="w-16 h-20 object-cover rounded bg-neutral-100 shrink-0 cursor-pointer"
                      onClick={() => {
                        setIsWishlistOpen(false);
                        navigateTo('product', { productId: product.id });
                      }}
                    />

                    <div className="flex-1 overflow-hidden">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                        {product.categoryName}
                      </span>
                      <h4 className="text-xs font-semibold min-w-0 mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsWishlistOpen(false);
                            navigateTo('product', { productId: product.id });
                          }}
                          className="block w-full text-left text-neutral-900 hover:text-neutral-600 transition-colors truncate"
                        >
                          {product.title}
                        </button>
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-neutral-900">{formatPrice(product.price)}</span>
                        {product.compareAtPrice && (
                          <span className="text-[11px] text-neutral-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="text-[10px] text-rose-600 font-semibold uppercase">
                            Out of stock
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!product.inStock}
                          onClick={() => {
                            addToCart(product, 1);
                            toggleWishlist(product.id);
                          }}
                          className="px-3 py-1.5 bg-neutral-900 disabled:bg-neutral-200 hover:bg-neutral-800 text-white text-[11px] font-semibold rounded transition-colors flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors rounded"
                          aria-label="Remove item from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-white">
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="w-full py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add In-Stock Items to Bag</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
