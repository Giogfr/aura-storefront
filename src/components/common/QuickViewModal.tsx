import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Star, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, navigateTo, formatPrice } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIndex(0);
      setSelectedColor(quickViewProduct.colors.length > 0 ? quickViewProduct.colors[0].name : '');
      setSelectedSize(
        quickViewProduct.sizes && quickViewProduct.sizes.length > 0
          ? quickViewProduct.sizes[0].label
          : ''
      );
      setQuantity(1);
      setIsAdded(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    if (!quickViewProduct.inStock) return;
    addToCart(quickViewProduct, quantity, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      closeQuickView();
    }, 600);
  };

  const handleGoToProductPage = () => {
    closeQuickView();
    navigateTo('product', { productId: quickViewProduct.id });
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${quickViewProduct.title}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeQuickView}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-3xl w-full overflow-hidden z-10 my-8 animate-fade-in">
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 text-neutral-600 hover:text-neutral-900 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="bg-neutral-100 p-6 flex flex-col justify-between">
            <div className="aspect-[3/4] w-full overflow-hidden rounded bg-white relative shadow-xs">
              <img
                src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.title}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {quickViewProduct.isSale && (
                <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold tracking-wider uppercase bg-rose-600 text-white rounded shadow-xs">
                  Sale
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image ${idx + 1} of ${quickViewProduct.images.length}`}
                    aria-current={activeImageIndex === idx}
                    className={`w-14 h-16 rounded overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-neutral-900' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info and Variant Selection */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {quickViewProduct.categoryName}
                </span>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-neutral-700">{quickViewProduct.rating}</span>
                  <span className="text-neutral-400">({quickViewProduct.reviewCount})</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 mb-2 leading-snug">
                {quickViewProduct.title}
              </h2>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-neutral-900">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.compareAtPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(quickViewProduct.compareAtPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 mb-6">
                {quickViewProduct.description}
              </p>

              {/* Color Options */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-neutral-500 font-medium">Color:</span>
                    <span className="text-neutral-900 font-semibold">{selectedColor}</span>
                  </div>
                  <div className="flex gap-2">
                    {quickViewProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === color.name
                            ? 'ring-2 ring-neutral-900 ring-offset-2 border-white'
                            : 'border-neutral-300 hover:border-neutral-500'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={`Select color ${color.name}`}
                        aria-pressed={selectedColor === color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-neutral-500 font-medium">Size:</span>
                    <span className="text-neutral-900 font-semibold">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size.label}
                        type="button"
                        disabled={!size.inStock}
                        aria-pressed={selectedSize === size.label}
                        onClick={() => setSelectedSize(size.label)}
                        className={`min-w-10 h-9 px-3 text-xs font-semibold rounded border transition-all ${
                          selectedSize === size.label
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : size.inStock
                            ? 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-900'
                            : 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed line-through'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs text-neutral-500 font-medium">Quantity:</span>
                <div className="flex items-center border border-neutral-200 rounded">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-semibold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(quickViewProduct.inventoryCount || 99, q + 1))}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {quickViewProduct.inStock && (
                  <span className="text-xs text-emerald-600 font-medium">
                    {quickViewProduct.inventoryCount} in stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <button
                type="button"
                disabled={!quickViewProduct.inStock}
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-6 rounded text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{quickViewProduct.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGoToProductPage}
                className="w-full py-2.5 text-xs text-neutral-600 hover:text-neutral-900 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Complete Product Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
