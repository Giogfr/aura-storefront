import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { storeConfig } from '../data/storeConfig';
import {
  Lock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  CheckCircle2,
  Tag,
  Package,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartDiscountAmount,
    cartShippingFee,
    cartTaxAmount,
    discountCode,
    discountPercent,
    applyDiscount,
    removeDiscount,
    navigateTo,
    user,
    formatPrice,
    showToast,
    setIsAccountOpen,
  } = useStore();

  // Multi-step progress
  const [step, setStep] = useState<'information' | 'shipping' | 'payment'>('information');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Mobile order summary accordion
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Form states
  const [email, setEmail] = useState(user ? user.email : 'customer@example.com');
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Doe');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [apartment, setApartment] = useState('Apt 4B');
  const [city, setCity] = useState('Springfield');
  const [stateCode, setStateCode] = useState('OR');
  const [postalCode, setPostalCode] = useState('97477');
  const [phone, setPhone] = useState('(555) 019-2834');

  // Shipping method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment method
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('382');
  const [cardName, setCardName] = useState('Jane Doe');

  // Promo code in checkout
  const [checkoutPromo, setCheckoutPromo] = useState('');

  const shippingCost = shippingMethod === 'express' ? storeConfig.expressShippingFee : cartShippingFee;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscountAmount + shippingCost + cartTaxAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPromo.trim()) return;
    const res = applyDiscount(checkoutPromo);
    if (res.success) {
      showToast('Discount code applied!', 'success');
    } else {
      showToast(res.message, 'warning');
    }
    setCheckoutPromo('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `AU-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExpressCheckout = (provider: string) => {
    showToast(`${provider} express checkout is simulated in this demo.`, 'info');
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop';

  if (orderPlaced) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-1">
          Demo Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif-heading mb-2">
          Thank you, {firstName}!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-md mx-auto leading-relaxed">
          This is a simulated checkout. No payment was processed and no email is sent — we generated a sample order for <strong>{email}</strong> to demonstrate the confirmation flow.
        </p>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 max-w-md mx-auto text-left text-xs space-y-3 mb-8 shadow-xs">
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="text-neutral-500">Order Reference:</span>
            <span className="font-mono font-bold text-neutral-900">{orderId}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="text-neutral-500">Shipping Address:</span>
            <span className="text-neutral-900 text-right">
              {address} {apartment ? `, ${apartment}` : ''}, {city}, {stateCode} {postalCode}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="text-neutral-500">Delivery Method:</span>
            <span className="text-neutral-900 capitalize">
              {shippingMethod === 'express' ? 'Express Priority Air (1–2 Days)' : 'Standard Insured (3–5 Days)'}
            </span>
          </div>
          <div className="flex justify-between pt-1 font-bold text-neutral-900 text-sm">
            <span>Order Total:</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors shadow-xs min-h-[44px]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 sm:py-28 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif-heading mb-2">
          Your bag is empty
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
          Add a few pieces to your bag before heading to checkout.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors shadow-xs min-h-[44px]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Checkout Mini Header */}
      <header className="border-b border-neutral-200 py-4 px-4 sm:px-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="text-xl font-black tracking-widest text-neutral-900 font-serif-heading"
        >
          {storeConfig.storeName}
        </button>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Demo checkout — no real payment</span>
        </div>
      </header>

      {/* Mobile Order Summary Dropdown */}
      <div className="lg:hidden border-b border-neutral-200 bg-neutral-50">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full py-3.5 px-4 flex items-center justify-between text-xs font-semibold text-neutral-900 min-h-[44px]"
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-neutral-500" />
            <span>{mobileSummaryOpen ? 'Hide' : 'Show'} Order Summary</span>
            {mobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          <span className="text-sm font-bold">{formatPrice(grandTotal)}</span>
        </button>

        {mobileSummaryOpen && (
          <div className="p-4 border-t border-neutral-200 space-y-4 animate-fade-in">
            {/* Items preview */}
            <div className="divide-y divide-neutral-200">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3 text-xs">
                  <div className="relative">
                    <img
                      src={item.image || fallbackImage}
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                      className="w-12 h-14 object-cover rounded bg-neutral-200"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neutral-700 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-neutral-500 text-[11px]">
                      {item.selectedColor} {item.selectedSize && `/ ${item.selectedSize}`}
                    </p>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Left Column: Form & Stepper (lg:col-span-7) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:pr-14 space-y-8">
          {/* Breadcrumb Steps */}
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <button
              type="button"
              onClick={() => navigateTo('cart')}
              className="text-neutral-600 hover:text-neutral-900"
            >
              Cart
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setStep('information')}
              className={step === 'information' ? 'text-neutral-900 font-bold' : 'text-neutral-600'}
            >
              Information
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setStep('shipping')}
              className={step === 'shipping' ? 'text-neutral-900 font-bold' : 'text-neutral-600'}
            >
              Shipping
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setStep('payment')}
              className={step === 'payment' ? 'text-neutral-900 font-bold' : 'text-neutral-600'}
            >
              Payment
            </button>
          </nav>

          {/* Express Checkout Options */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block text-center">
              Express Checkout
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleExpressCheckout('Shop Pay')}
                className="py-2.5 bg-[#5a31f4] text-white text-xs font-bold rounded flex items-center justify-center hover:opacity-90 min-h-[44px]"
              >
                Shop Pay
              </button>
              <button
                type="button"
                onClick={() => handleExpressCheckout('Apple Pay')}
                className="py-2.5 bg-neutral-900 text-white text-xs font-bold rounded flex items-center justify-center hover:bg-neutral-800 min-h-[44px]"
              >
                Apple Pay
              </button>
              <button
                type="button"
                onClick={() => handleExpressCheckout('PayPal')}
                className="py-2.5 bg-[#ffc439] text-neutral-900 text-xs font-bold rounded flex items-center justify-center hover:opacity-90 min-h-[44px]"
              >
                PayPal
              </button>
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-200" />
              <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-neutral-400">
                OR
              </span>
              <div className="flex-grow border-t border-neutral-200" />
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Step 1: Contact & Shipping Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-neutral-900">Contact Information</h2>
                {!user && (
                  <button
                    type="button"
                    onClick={() => setIsAccountOpen(true)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                  >
                    Already have an account? Sign in
                  </button>
                )}
              </div>

              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address for receipt and delivery updates"
                  aria-label="Email address"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <h2 className="text-base font-bold text-neutral-900 pt-4">Shipping Address</h2>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  aria-label="First name"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  aria-label="Last name"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                aria-label="Street address"
                className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
              />

              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="Apartment, suite, unit (optional)"
                aria-label="Apartment, suite, or unit (optional)"
                className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  aria-label="City"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
                <input
                  type="text"
                  required
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  placeholder="State / Region"
                  aria-label="State or region"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="ZIP / Postal"
                  aria-label="ZIP or postal code"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile phone for delivery notifications"
                aria-label="Mobile phone"
                className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
              />
            </div>

            {/* Step 2: Shipping Method */}
            <div className="pt-4 space-y-3">
              <h2 className="text-base font-bold text-neutral-900">Delivery Method</h2>

              <div className="border border-neutral-300 rounded-lg divide-y divide-neutral-200 overflow-hidden text-xs">
                <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-neutral-900"
                    />
                    <div>
                      <span className="font-semibold text-neutral-900 block">
                        Standard Insured Ground
                      </span>
                      <span className="text-neutral-500">3–5 business days</span>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900">
                    {cartShippingFee === 0 ? 'FREE' : formatPrice(cartShippingFee)}
                  </span>
                </label>

                <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-neutral-900"
                    />
                    <div>
                      <span className="font-semibold text-neutral-900 block">
                        Express Priority Air
                      </span>
                      <span className="text-neutral-500">1–2 business days</span>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900">{formatPrice(storeConfig.expressShippingFee)}</span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Section */}
            <div className="pt-4 space-y-4">
              <h2 className="text-base font-bold text-neutral-900">Payment Selection</h2>
              <div className="border border-neutral-300 rounded-lg overflow-hidden text-xs">
                <div className="p-3.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-neutral-900">
                    <CreditCard className="w-4 h-4 text-neutral-700" />
                    <span>Credit or Debit Card</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">Visa, Mastercard, Amex</span>
                </div>

                <div className="p-4 space-y-3 bg-white">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card number"
                    aria-label="Card number"
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      aria-label="Card expiry date"
                      className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                    />
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="Security code (CVC)"
                      aria-label="Card security code"
                      className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    aria-label="Name on card"
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-md min-h-[44px]"
              >
                <Lock className="w-4 h-4" />
                <span>Place Demo Order · {formatPrice(grandTotal)}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Order Summary (lg:col-span-5) */}
        <div className="hidden lg:block lg:col-span-5 bg-neutral-50 p-8 lg:p-10 border-l border-neutral-200">
          <div className="sticky top-20 space-y-6">
            <h2 className="text-base font-bold text-neutral-900 font-serif-heading border-b border-neutral-200 pb-3">
              Order Items ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            {/* Items list */}
            <div className="divide-y divide-neutral-200 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={item.image || fallbackImage}
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                      className="w-14 h-16 object-cover rounded bg-neutral-200 border border-neutral-200"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neutral-700 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      {item.selectedColor} {item.selectedSize && `/ ${item.selectedSize}`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2 border-t border-neutral-200">
              <input
                type="text"
                value={checkoutPromo}
                onChange={(e) => setCheckoutPromo(e.target.value)}
                placeholder="Gift card or discount code"
                aria-label="Discount code"
                className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
              >
                Apply
              </button>
            </form>

            {discountCode && (
              <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                <span className="flex items-center gap-1 font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  Code {discountCode} (-{discountPercent}%)
                </span>
                <button
                  type="button"
                  onClick={removeDiscount}
                  className="text-emerald-900 hover:text-rose-600 text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Financial Line Items */}
            <div className="space-y-2 text-xs pt-3 border-t border-neutral-200 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(cartDiscountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span>{formatPrice(cartTaxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Total Due</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
