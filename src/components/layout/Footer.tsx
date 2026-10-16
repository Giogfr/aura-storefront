import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { storeConfig, categoriesData } from '../../data/storeConfig';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, showToast, activeCurrency, setActiveCurrency, availableCurrencies } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    showToast('Thank you for subscribing! Your 10% promo code: WELCOME10', 'success');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Newsletter Section */}
        <div className="pb-16 border-b border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
              Stay Connected
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-serif-heading">
              Join the Studio Inner Circle
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
              Receive early access to seasonal capsule drops, archive sales, and thoughtful editorial essays on modern design. Enjoy 10% off your initial order.
            </p>
          </div>

          <div className="lg:col-span-6">
            {newsletterSubmitted ? (
              <div className="p-4 bg-neutral-900 border border-neutral-700 rounded flex items-center gap-3 text-white text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="block text-emerald-400">You're subscribed! (demo)</strong>
                  Use code <span className="underline font-mono font-bold">WELCOME10</span> at checkout for 10% off.
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md lg:ml-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3 text-xs bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 rounded focus:outline-hidden focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <span className="text-[10px] text-neutral-500 mt-2 block lg:text-right">
              By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
            </span>
          </div>
        </div>

        {/* Middle: Links Architecture */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Col 1: Store Intro */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <span className="text-xl font-black tracking-widest text-white font-serif-heading block">
              {storeConfig.storeName}
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed pr-4">
              {storeConfig.storeTagline}. Crafted with responsible materials and built to endure season after season.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <p>{storeConfig.address}</p>
              <p className="text-white font-medium">{storeConfig.contactEmail}</p>
              <p>{storeConfig.contactPhone}</p>
            </div>
          </div>

          {/* Col 2: Catalog */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Shop Categories
            </span>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">
                  All Products
                </button>
              </li>
              {categoriesData.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo('shop', { categoryId: cat.id })}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigateTo('collections')} className="hover:text-white transition-colors">
                  All Collections
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Customer Care
            </span>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigateTo('shipping-returns')} className="hover:text-white transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping-returns')} className="hover:text-white transition-colors">
                  30-Day Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Contact Customer Concierge
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-white transition-colors">
                  View Shopping Bag
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: About Company */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Our Studio
            </span>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  About Our Brand
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Material Transparency
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Sustainability Commitments
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Retail Stockists
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Preferences */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Policies
            </span>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigateTo('privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping-returns')} className="hover:text-white transition-colors">
                  Return Terms
                </button>
              </li>
            </ul>

            {/* Currency Selector */}
            <div className="pt-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1.5">
                Currency & Region
              </label>
              <select
                value={activeCurrency.code}
                onChange={(e) => {
                  const next = availableCurrencies.find((c) => c.code === e.target.value);
                  if (next) setActiveCurrency(next);
                }}
                aria-label="Select currency and region"
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded px-2.5 py-1.5 focus:outline-hidden focus:border-neutral-600"
              >
                {availableCurrencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px]">
            <span>© {new Date().getFullYear()} {storeConfig.storeName} Storefront Inc. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Demo template — no live transactions
            </span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'PayPal', 'Klarna'].map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 text-[10px] font-semibold bg-neutral-900 text-neutral-400 border border-neutral-800 rounded tracking-wider uppercase"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
