import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { storeConfig } from '../data/storeConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Lock,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { FALLBACK_PRODUCT_IMAGE } from '../lib/images';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartDiscountAmount,
    cartShippingFee,
    cartTaxAmount,
    cartTotal,
    discountCode,
    discountPercent,
    applyDiscount,
    removeDiscount,
    navigateTo,
    formatPrice,
    showToast,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const freeShippingThreshold = storeConfig.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscount(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const handleQuickPromo = (code: string) => {
    const res = applyDiscount(code);
    if (res.success) {
      showToast(`Applied code ${code}!`, 'success');
    } else {
      showToast(res.message, 'warning');
    }
  };

  const fallbackImage = FALLBACK_PRODUCT_IMAGE;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-heading mb-3">
            Your Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mb-8 leading-relaxed">
            You currently have no items in your shopping bag. Explore our collection to discover heirloom-quality garments and home goods.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-2 min-h-[44px]"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

      <div className="py-6 border-b border-neutral-200 flex items-baseline justify-between">
        <h1 className="text-2xl sm:text-4xl font-bold text-neutral-900 font-heading">
          Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-neutral-400 hover:text-rose-600 transition-colors font-medium p-1"
        >
          Empty Bag
        </button>
      </div>

      {/* Free Shipping Progress Meter */}
      <div className="my-6 p-4 bg-neutral-50 border border-neutral-200/80 rounded-lg">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 mb-2">
          <Truck className="w-4 h-4 text-neutral-700" />
          {remainingForFreeShipping === 0 ? (
            <span className="text-emerald-700">You've unlocked complimentary standard shipping!</span>
          ) : (
            <span>
              Add <strong className="text-neutral-900">{formatPrice(remainingForFreeShipping)}</strong> more to qualify for Free Shipping
            </span>
          )}
        </div>
        <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cart Items List (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-neutral-200 border-b border-neutral-200">
            {cart.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                {/* Product Thumbnail */}
                <img
                  src={item.image || fallbackImage}
                  alt={item.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                  onClick={() => navigateTo('product', { productId: item.productId })}
                  className="w-24 h-30 sm:w-28 sm:h-36 object-cover rounded bg-neutral-100 cursor-pointer shrink-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between w-full space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                        {item.product?.categoryName || 'Curated Essential'}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold min-w-0">
                        <button
                          type="button"
                          onClick={() => navigateTo('product', { productId: item.productId })}
                          className="text-left text-neutral-900 hover:text-neutral-600 transition-colors"
                        >
                          {item.title}
                        </button>
                      </h3>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          {item.selectedColor && item.selectedSize && <span> / </span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-neutral-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-neutral-300 rounded h-8">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 text-xs"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 text-xs"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1.5 transition-colors flex items-center gap-1 text-xs"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Apply Promos */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              Available Store Promotions:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'WELCOME10', desc: '10% off your entire order' },
                { code: 'SAVE20', desc: '20% off your entire order' },
                { code: 'FREESHIP', desc: 'Complimentary shipping waiver' },
              ].map((promo) => (
                <button
                  key={promo.code}
                  type="button"
                  onClick={() => handleQuickPromo(promo.code)}
                  className="px-2.5 py-1 text-xs bg-white border border-neutral-300 hover:border-neutral-900 rounded flex items-center gap-1.5 text-neutral-800 transition-colors"
                  title={promo.desc}
                >
                  <Tag className="w-3 h-3 text-neutral-500" />
                  <span className="font-mono font-bold">{promo.code}</span>
                  <span className="text-neutral-400 text-[10px]">({promo.desc.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order notes & gifting */}
          <div className="pt-2">
            <label
              htmlFor="cart-order-note"
              className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2"
            >
              Special Order Notes & Gift Instructions
            </label>
            <textarea
              id="cart-order-note"
              rows={3}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Leave specific delivery instructions or a handwritten gift note..."
              className="w-full p-3 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900 bg-white"
            />
          </div>
        </div>

        {/* Right: Order Summary Card (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-50 border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h2 className="text-base font-bold text-neutral-900 font-heading border-b border-neutral-200 pb-3">
              Order Summary
            </h2>

            {/* Promo Code input */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Coupon code (e.g. WELCOME10)"
                  aria-label="Coupon code"
                  className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>

              {promoMessage && (
                <p className={`text-[11px] font-medium ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {promoMessage.text}
                </p>
              )}

              {discountCode && (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      {discountCode} ({discountPercent}% OFF)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeDiscount}
                    className="text-emerald-900 hover:text-rose-600 text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Price Line Items */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {cartDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Savings ({discountCode})</span>
                  <span>-{formatPrice(cartDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Shipping</span>
                <span>{cartShippingFee === 0 ? 'FREE' : formatPrice(cartShippingFee)}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Sales Tax</span>
                <span>{formatPrice(cartTaxAmount)}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Estimated Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigateTo('checkout')}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Express Checkout Options */}
            <div className="pt-2 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-2">
                Or Instant One-Tap Checkout
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('checkout')}
                  className="py-2.5 bg-neutral-900 text-white text-xs font-bold rounded flex items-center justify-center hover:bg-neutral-800 min-h-[44px]"
                >
                  Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('checkout')}
                  className="py-2.5 bg-amber-400 text-neutral-900 text-xs font-bold rounded flex items-center justify-center hover:bg-amber-500 min-h-[44px]"
                >
                  PayPal
                </button>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="pt-3 border-t border-neutral-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Demo checkout — no payment is processed</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Payments, orders, and totals in this template are simulated for demonstration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
