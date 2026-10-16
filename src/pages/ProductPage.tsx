import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';
import { storeConfig } from '../data/storeConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGrid } from '../components/common/ProductGrid';
import { ProductReview } from '../types';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Ruler,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const ProductPage: React.FC = () => {
  const {
    routeParams,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    recentlyViewed,
    navigateTo,
    showToast,
    formatPrice,
  } = useStore();

  const productId = routeParams.productId || 'prod-1';
  const product = productsData.find((p) => p.id === productId) || productsData[0];

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Variant selection state
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Accordion open states
  const [accordionState, setAccordionState] = useState<{
    specs: boolean;
    materials: boolean;
    shipping: boolean;
  }>({
    specs: true,
    materials: false,
    shipping: true,
  });

  // Size guide modal state
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<ProductReview[]>([]);

  // Update on product change
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors.length > 0 ? product.colors[0].name : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0].label : '');
      setQuantity(1);
      setLocalReviews(product.reviews || []);
      addRecentlyViewed(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, addRecentlyViewed]);

  // Monitor scroll for sticky bottom add-to-cart bar
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once scrolled down 450px
      setShowStickyBar(window.scrollY > 550);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard controls and scroll lock for overlays (lightbox, size guide, review modal)
  useEffect(() => {
    if (!isZoomOpen && !sizeGuideOpen && !reviewModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
        setSizeGuideOpen(false);
        setReviewModalOpen(false);
      } else if (isZoomOpen && e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % product.images.length);
      } else if (isZoomOpen && e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isZoomOpen, sizeGuideOpen, reviewModalOpen, product.images.length]);

  const isSaved = isInWishlist(product.id);

  const addedReviewCount = Math.max(0, localReviews.length - (product.reviews?.length || 0));
  const totalReviewCount = product.reviewCount + addedReviewCount;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity, selectedColor, selectedSize);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 1200);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    addToCart(product, quantity, selectedColor, selectedSize);
    navigateTo('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewTitle.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle.trim(),
      comment: newReviewComment.trim(),
      verifiedPurchase: false,
    };

    setLocalReviews([newRev, ...localReviews]);
    setReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    showToast('Review added to this demo session.', 'success');
  };

  const relatedProducts = productsData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const otherRecentlyViewed = recentlyViewed.filter((p) => p.id !== product.id).slice(0, 4);

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const fallbackImage = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Shop', page: 'shop' },
          { label: product.categoryName, page: 'shop', params: { categoryId: product.category } },
          { label: product.title },
        ]}
      />

      {/* Main Product Layout */}
      <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Gallery Column (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Showcase Image */}
          <div className="relative aspect-[4/5] w-full bg-neutral-100 rounded-lg overflow-hidden group shadow-xs">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
              className="w-full h-full object-cover transition-transform duration-500"
            />

            {/* Zoom / Lightbox Trigger Button */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              aria-label="Enlarge image"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {!product.inStock && (
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white rounded shadow-xs">
                  Sold Out
                </span>
              )}
              {product.isSale && (
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-600 text-white rounded shadow-xs">
                  {discountPercentage > 0 ? `-${discountPercentage}% Off` : 'Archive Sale'}
                </span>
              )}
              {product.isNew && (
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white rounded shadow-xs">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 sm:w-24 sm:h-28 rounded-md overflow-hidden bg-neutral-100 border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
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

        {/* Right Details Column (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-neutral-200 text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-neutral-800">{product.rating.toFixed(1)}</span>
                <span className="text-neutral-400">
                  ({totalReviewCount} reviews)
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-heading leading-tight mb-2">
              {product.title}
            </h1>

            <p className="text-xs text-neutral-500 italic mb-4">
              {product.tagline}
            </p>

            {/* Price & Stock status */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {product.isSale && product.compareAtPrice && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500 font-medium">
                  Color: <strong className="text-neutral-900">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === color.name
                        ? 'ring-2 ring-neutral-900 ring-offset-2 border-white'
                        : 'border-neutral-300 hover:border-neutral-500'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === color.name && (
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size / Variant Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500 font-medium">
                  Size: <strong className="text-neutral-900">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 underline text-xs"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    disabled={!size.inStock}
                    onClick={() => setSelectedSize(size.label)}
                    className={`min-w-12 h-10 px-3.5 text-xs font-semibold rounded border transition-all ${
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

          {/* Quantity & Add to Cart & Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-neutral-300 rounded h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.inventoryCount || 99, q + 1))}
                  className="w-10 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={`flex-1 h-11 text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 ${
                  isAddedToCart
                    ? 'bg-emerald-700 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`w-11 h-11 rounded border flex items-center justify-center transition-colors shrink-0 ${
                  isSaved
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-neutral-300 hover:border-neutral-900 text-neutral-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            {product.inStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Instant Checkout</span>
              </button>
            )}
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/70 text-xs text-neutral-600 flex items-center gap-3">
            <Truck className="w-5 h-5 text-neutral-800 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-900 block">
                Complimentary Shipping Included
              </span>
              <span>Qualifies for free delivery on orders over {formatPrice(storeConfig.freeShippingThreshold)}.</span>
            </div>
          </div>

          {/* Accordions: Details & Specs, Materials & Care, Shipping & Returns */}
          <div className="pt-2 divide-y divide-neutral-200 border-y border-neutral-200">
            {/* Accordion 1: Details & Specifications */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() =>
                  setAccordionState((prev) => ({ ...prev, specs: !prev.specs }))
                }
                className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                <span>Features & Specifications</span>
                {accordionState.specs ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {accordionState.specs && (
                <div className="pt-3 space-y-3 text-xs text-neutral-600">
                  <ul className="list-disc pl-4 space-y-1">
                    {product.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>

                  {product.specifications && (
                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-2.5 rounded">
                      {Object.entries(product.specifications).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-neutral-400 uppercase font-semibold">{k}:</span>
                          <span className="text-neutral-800 font-medium ml-1">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 2: Materials & Care */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() =>
                  setAccordionState((prev) => ({ ...prev, materials: !prev.materials }))
                }
                className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                <span>Materials & Garment Care</span>
                {accordionState.materials ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {accordionState.materials && (
                <div className="pt-3 space-y-2 text-xs text-neutral-600 leading-relaxed">
                  <p>
                    <strong className="text-neutral-900">Composition:</strong> {product.materials}
                  </p>
                  <p>
                    <strong className="text-neutral-900">Care Instructions:</strong> {product.careInstructions}
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 3: Shipping & 30-Day Returns */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() =>
                  setAccordionState((prev) => ({ ...prev, shipping: !prev.shipping }))
                }
                className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                <span>Shipping & 30-Day Returns</span>
                {accordionState.shipping ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {accordionState.shipping && (
                <div className="pt-3 space-y-2 text-xs text-neutral-600 leading-relaxed">
                  <p>{product.shippingInfo}</p>
                  <p>
                    Orders placed before 2:00 PM EST ship same day from our fulfillment studio. Standard delivery takes 3-5 business days. Express 2-day delivery is available at checkout.
                  </p>
                  <p>
                    We offer prepaid digital return shipping labels for all domestic returns initiated within 30 days of confirmed receipt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-20 pt-12 border-t border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-heading">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-900">
                {product.rating} out of 5 based on {totalReviewCount} ratings
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReviewModalOpen(true)}
            className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded hover:bg-neutral-800 transition-colors shrink-0 min-h-[44px]"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {localReviews.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-xs text-neutral-500 bg-neutral-50 rounded">
              Be the first to review this product and share your thoughts with our community.
            </div>
          ) : (
            localReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-lg border border-neutral-200/80 bg-white space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">{rev.date}</span>
                </div>

                <h4 className="text-xs font-bold text-neutral-900">{rev.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>

                <div className="pt-2 flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                  <span>{rev.author}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-emerald-700 text-[10px] font-semibold flex items-center gap-0.5">
                      • Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-neutral-200">
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Complementary Pieces
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 font-heading">
              Related in {product.categoryName}
            </h2>
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}

      {/* Recently Viewed Section */}
      {otherRecentlyViewed.length > 0 && (
        <section className="mt-20 pt-12 border-t border-neutral-200">
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Your Session History
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 font-heading">
              Recently Viewed
            </h2>
          </div>
          <ProductGrid products={otherRecentlyViewed} columns={4} />
        </section>
      )}

      {/* Sticky Bottom Add-to-Cart Bar (Desktop & Mobile) */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-xl py-3 px-4 sm:px-8 z-30 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={product.images[0]}
                alt=""
                className="w-11 h-13 object-cover rounded bg-neutral-100 shrink-0"
              />
              <div className="truncate">
                <h4 className="text-xs font-bold text-neutral-900 truncate">{product.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-900">{formatPrice(product.price)}</span>
                  {selectedColor && <span className="text-[10px] text-neutral-400">• {selectedColor}</span>}
                  {selectedSize && <span className="text-[10px] text-neutral-400">• {selectedSize}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged product image viewer"
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            aria-label="Close zoom"
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous image button */}
          {product.images.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
              }
              aria-label="Previous image"
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={product.images[activeImageIndex]}
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded select-none"
          />

          {/* Next image button */}
          {product.images.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setActiveImageIndex((prev) => (prev + 1) % product.images.length)
              }
              aria-label="Next image"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Garment size guide"
        >
          <div className="fixed inset-0 bg-black/60" onClick={() => setSizeGuideOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
              <h3 className="text-base font-bold text-neutral-900">Garment Size Guide</h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="text-neutral-500 hover:text-neutral-900 p-1"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              All measurements are standard in inches. For a relaxed comfortable drape, select your standard size. For a closer tailored silhouette, consider sizing down.
            </p>
            <table className="w-full text-xs text-left border-collapse border border-neutral-200">
              <thead>
                <tr className="bg-neutral-100 text-neutral-900">
                  <th className="p-2.5 border border-neutral-200">Size</th>
                  <th className="p-2.5 border border-neutral-200">Chest</th>
                  <th className="p-2.5 border border-neutral-200">Waist</th>
                  <th className="p-2.5 border border-neutral-200">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="p-2.5 font-bold border border-neutral-200">XS</td>
                  <td className="p-2.5 border border-neutral-200">34-36"</td>
                  <td className="p-2.5 border border-neutral-200">28-30"</td>
                  <td className="p-2.5 border border-neutral-200">27"</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-neutral-200">S</td>
                  <td className="p-2.5 border border-neutral-200">36-38"</td>
                  <td className="p-2.5 border border-neutral-200">30-32"</td>
                  <td className="p-2.5 border border-neutral-200">28"</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-neutral-200">M</td>
                  <td className="p-2.5 border border-neutral-200">38-40"</td>
                  <td className="p-2.5 border border-neutral-200">32-34"</td>
                  <td className="p-2.5 border border-neutral-200">29"</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-neutral-200">L</td>
                  <td className="p-2.5 border border-neutral-200">41-43"</td>
                  <td className="p-2.5 border border-neutral-200">34-36"</td>
                  <td className="p-2.5 border border-neutral-200">30"</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-neutral-200">XL</td>
                  <td className="p-2.5 border border-neutral-200">44-46"</td>
                  <td className="p-2.5 border border-neutral-200">36-38"</td>
                  <td className="p-2.5 border border-neutral-200">31"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Write a review"
        >
          <div className="fixed inset-0 bg-black/60" onClick={() => setReviewModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6 z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-base font-bold text-neutral-900">Write a Review</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-900 p-1"
                aria-label="Close review modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Overall Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReviewRating(s)}
                      aria-label={`${s} stars`}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= newReviewRating ? 'fill-amber-400' : 'fill-neutral-200 text-neutral-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-author"
                  className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1"
                >
                  Your Name
                </label>
                <input
                  id="review-author"
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Liam H."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <div>
                <label
                  htmlFor="review-title"
                  className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1"
                >
                  Review Headline
                </label>
                <input
                  id="review-title"
                  type="text"
                  required
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional handfeel and fit"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1"
                >
                  Comments
                </label>
                <textarea
                  id="review-comment"
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Tell other shoppers how the material feels and how it fits..."
                  className="w-full p-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors min-h-[44px]"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
