import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { storeConfig } from '../../data/storeConfig';
import { productsData } from '../../data/products';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Tag, Plus, Check, Copy } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    discountCode,
    applyDiscount,
    removeDiscount,
    updateQuantity,
    removeFromCart,
    addToCart,
    navigateTo,
    formatPrice,
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [discountMsg, setDiscountMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [showOrderNote, setShowOrderNote] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Free shipping calculation
  const freeShippingThreshold = storeConfig.freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  // Cross-sell items (products not currently in cart)
  const cartProductIds = new Set(cart.map((item) => item.productId));
  const crossSellProducts = productsData.filter((p) => !cartProductIds.has(p.id) && p.inStock).slice(0, 2);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyDiscount(inputCode);
    setDiscountMsg({ text: res.message, isError: !res.success });
    if (res.success) setInputCode('');
  };

  const handleQuickCopyCode = (code: string) => {
    setInputCode(code);
    applyDiscount(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleGoToCartPage = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base font-bold text-neutral-900">Your Bag</h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full">
              {cartCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Tier Bar */}
        <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200">
          <div className="flex items-center gap-2 mb-1.5 text-xs text-neutral-700 font-medium">
            <Truck className="w-4 h-4 text-neutral-900 shrink-0" />
            {amountToFreeShipping > 0 ? (
              <span>
                Add <span className="font-bold text-neutral-900">{formatPrice(amountToFreeShipping)}</span> more for{' '}
                <span className="font-semibold text-neutral-900">Free Shipping</span>
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> You've unlocked Complimentary Free Shipping!
              </span>
            )}
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                amountToFreeShipping === 0 ? 'bg-emerald-600' : 'bg-neutral-900'
              }`}
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-1">Your bag is currently empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs mb-6 leading-relaxed">
                Explore our curated everyday essentials and timeless pieces crafted to endure.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
              >
                Shop All Products
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="divide-y divide-neutral-100">
                {cart.map((item) => (
                  <div key={item.id} className="py-3.5 flex gap-3.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                      className="w-18 h-22 object-cover rounded bg-neutral-100 shrink-0 cursor-pointer"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigateTo('product', { productId: item.productId });
                      }}
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold min-w-0">
                            <button
                              type="button"
                              onClick={() => {
                                setIsCartOpen(false);
                                navigateTo('product', { productId: item.productId });
                              }}
                              className="block w-full text-left text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1"
                            >
                              {item.title}
                            </button>
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-1 -mr-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variants */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-neutral-500">
                            {item.selectedColor && (
                              <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">
                                Size {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-neutral-200 rounded">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 text-xs transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 text-xs transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-neutral-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cross-Sell Recommendations */}
              {crossSellProducts.length > 0 && (
                <div className="pt-4 border-t border-neutral-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                    Recommended Additions
                  </span>
                  <div className="space-y-2">
                    {crossSellProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200/60"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <img
                            src={p.images[0]}
                            alt=""
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackImage;
                            }}
                            className="w-10 h-12 object-cover rounded bg-white shrink-0"
                          />
                          <div className="truncate">
                            <h5 className="text-xs font-medium text-neutral-900 truncate">{p.title}</h5>
                            <span className="text-xs font-bold text-neutral-900">{formatPrice(p.price)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(p, 1)}
                          className="px-2.5 py-1 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded transition-colors flex items-center gap-1 shrink-0 ml-2"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Promo Code & Order Note toggles */}
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(!showPromoInput)}
                    aria-expanded={showPromoInput}
                    className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{discountCode ? `Code applied: ${discountCode}` : 'Add promo code'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderNote(!showOrderNote)}
                    aria-expanded={showOrderNote}
                    className="text-neutral-500 hover:text-neutral-900 text-xs"
                  >
                    {orderNote ? 'Edit note' : 'Add order note'}
                  </button>
                </div>

                {/* Quick copyable sample promo tags */}
                {!discountCode && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
                    <span>Try:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickCopyCode('WELCOME10')}
                      className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-mono text-[10px] font-semibold flex items-center gap-1"
                    >
                      <span>WELCOME10</span>
                      {copiedCode === 'WELCOME10' && <Check className="w-2.5 h-2.5 text-emerald-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickCopyCode('SAVE20')}
                      className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-mono text-[10px] font-semibold flex items-center gap-1"
                    >
                      <span>SAVE20</span>
                      {copiedCode === 'SAVE20' && <Check className="w-2.5 h-2.5 text-emerald-600" />}
                    </button>
                  </div>
                )}

                {showPromoInput && (
                  <form onSubmit={handleApplyPromo} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      aria-label="Promo code"
                      className="flex-1 px-3 py-1.5 text-xs uppercase border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded hover:bg-neutral-800 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {discountMsg && (
                  <p className={`text-[11px] ${discountMsg.isError ? 'text-rose-600' : 'text-emerald-700 font-medium'}`}>
                    {discountMsg.text}
                  </p>
                )}

                {discountCode && (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded">
                    <span>Active code: <strong>{discountCode}</strong></span>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-emerald-900 hover:underline text-[11px] font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {showOrderNote && (
                  <div className="pt-1">
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      rows={2}
                      placeholder="Special instructions for shipping or delivery..."
                      aria-label="Order note"
                      className="w-full text-xs p-2 border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo discount</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {cartShipping === 0 ? (
                    <strong className="text-emerald-700">Free</strong>
                  ) : (
                    formatPrice(cartShipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Estimated Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleGoToCartPage}
                className="w-full py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 text-center transition-colors block"
              >
                View Full Bag Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
