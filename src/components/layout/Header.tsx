import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { storeConfig, categoriesData } from '../../data/storeConfig';
import { productsData } from '../../data/products';
import { MobileMenu } from './MobileMenu';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    navigateTo,
    currentPage,
    cartCount,
    cartBumping,
    wishlistCount,
    setIsSearchOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAccountOpen,
    activeCurrency,
    setActiveCurrency,
    availableCurrencies,
    formatPrice,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);

  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rotate announcement messages
  useEffect(() => {
    if (!storeConfig.announcementBar.enabled || isAnnouncementPaused) return;
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % storeConfig.announcementBar.messages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAnnouncementPaused]);

  // Track scroll state for compact sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the currency menu on Escape
  useEffect(() => {
    if (!currencyMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCurrencyMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currencyMenuOpen]);

  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setShopMenuOpen(true);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShopMenuOpen(false);
    }, 150);
  };

  const featuredMegaItem = productsData.find((p) => p.isFeatured) || productsData[0];

  return (
    <>
      {/* Mobile drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Top Announcement Bar */}
      {storeConfig.announcementBar.enabled && (
        <div
          className="bg-neutral-950 text-neutral-300 text-[11px] sm:text-xs py-2 px-4 relative z-[45] transition-colors"
          onMouseEnter={() => setIsAnnouncementPaused(true)}
          onMouseLeave={() => setIsAnnouncementPaused(false)}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Currency Selector (Desktop) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Select currency"
                aria-haspopup="listbox"
                aria-expanded={currencyMenuOpen}
              >
                <Globe className="w-3 h-3" aria-hidden="true" />
                <span className="font-medium">{activeCurrency.code} ({activeCurrency.symbol})</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${currencyMenuOpen ? 'rotate-180' : 'opacity-70'}`} aria-hidden="true" />
              </button>

              {currencyMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCurrencyMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    role="listbox"
                    aria-label="Available currencies"
                    className="absolute top-full left-0 mt-1.5 w-36 bg-neutral-900 border border-neutral-800 rounded shadow-xl py-1 z-50 animate-fade-in"
                  >
                    {availableCurrencies.map((curr) => (
                      <button
                        key={curr.code}
                        type="button"
                        role="option"
                        aria-selected={activeCurrency.code === curr.code}
                        onClick={() => {
                          setActiveCurrency(curr);
                          setCurrencyMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-800 transition-colors ${
                          activeCurrency.code === curr.code ? 'text-white font-bold bg-neutral-800/50' : 'text-neutral-400'
                        }`}
                      >
                        <span>{curr.label}</span>
                        {activeCurrency.code === curr.code && <span className="text-[10px] text-emerald-400" aria-hidden="true">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Announcement Message Carousel */}
            <div className="flex-1 flex items-center justify-center gap-3 text-center px-4">
              <button
                type="button"
                onClick={() =>
                  setAnnouncementIndex(
                    (prev) => (prev - 1 + storeConfig.announcementBar.messages.length) % storeConfig.announcementBar.messages.length
                  )
                }
                className="text-neutral-500 hover:text-white transition-colors p-0.5"
                aria-label="Previous message"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>

              <span className="font-medium tracking-wide transition-opacity duration-300">
                {storeConfig.announcementBar.messages[announcementIndex]}
              </span>

              <button
                type="button"
                onClick={() =>
                  setAnnouncementIndex((prev) => (prev + 1) % storeConfig.announcementBar.messages.length)
                }
                className="text-neutral-500 hover:text-white transition-colors p-0.5"
                aria-label="Next message"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Free shipping perk indicator */}
            <div className="hidden md:flex items-center gap-4 text-neutral-400 text-[11px]">
              <span>Complimentary shipping over {formatPrice(storeConfig.freeShippingThreshold)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all duration-300 ${
          isScrolled ? 'py-2.5 shadow-xs' : 'py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center">
            {/* Left: Mobile hamburger & Desktop Nav */}
            <div className="flex items-center gap-4 lg:gap-8 justify-self-start">
              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile navigation"
                className="lg:hidden p-2 -ml-2 text-neutral-700 hover:text-neutral-900 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-700">
                {/* Shop Mega Menu Trigger */}
                <div
                  className="relative group"
                  onMouseEnter={handleMenuEnter}
                  onMouseLeave={handleMenuLeave}
                >
                  <button
                    type="button"
                    onClick={() => navigateTo('shop')}
                    className={`flex items-center gap-1 py-2 hover:text-neutral-900 transition-colors ${
                      currentPage === 'shop' ? 'text-neutral-900 font-bold' : ''
                    }`}
                  >
                    <span>Shop</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                        shopMenuOpen ? 'rotate-180 text-neutral-900' : ''
                      }`}
                    />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {shopMenuOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-[720px] bg-white border border-neutral-200/90 shadow-2xl rounded-lg p-6 grid grid-cols-3 gap-6 animate-fade-in z-50"
                      onMouseEnter={handleMenuEnter}
                      onMouseLeave={handleMenuLeave}
                    >
                      {/* Col 1: Categories */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                          Categories
                        </span>
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setShopMenuOpen(false);
                              navigateTo('shop');
                            }}
                            className="block text-xs font-bold text-neutral-900 hover:underline text-left w-full"
                          >
                            All Products ({productsData.length})
                          </button>
                          {categoriesData.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setShopMenuOpen(false);
                                navigateTo('shop', { categoryId: cat.id });
                              }}
                              className="block text-xs text-neutral-600 hover:text-neutral-900 hover:translate-x-0.5 transition-transform text-left w-full"
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Col 2: Featured Curations */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                          Featured Curations
                        </span>
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setShopMenuOpen(false);
                              navigateTo('shop', { curationFilter: 'sale' });
                            }}
                            className="block text-xs text-rose-600 font-semibold hover:underline text-left w-full"
                          >
                            Archive Sale (Up to 40% off)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShopMenuOpen(false);
                              navigateTo('shop', { curationFilter: 'new' });
                            }}
                            className="block text-xs text-neutral-700 hover:text-neutral-900 text-left w-full"
                          >
                            New Season Arrivals
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShopMenuOpen(false);
                              navigateTo('shop', { curationFilter: 'bestseller' });
                            }}
                            className="block text-xs text-neutral-700 hover:text-neutral-900 text-left w-full"
                          >
                            Bestselling Staples
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShopMenuOpen(false);
                              navigateTo('collections');
                            }}
                            className="block text-xs text-neutral-700 hover:text-neutral-900 text-left w-full pt-1"
                          >
                            Collections Directory →
                          </button>
                        </div>
                      </div>

                      {/* Col 3: Visual highlight card */}
                      <button
                        type="button"
                        onClick={() => {
                          setShopMenuOpen(false);
                          navigateTo('product', { productId: featuredMegaItem.id });
                        }}
                        className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-100 hover:border-neutral-300 transition-all cursor-pointer group/card flex flex-col justify-between text-left"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden rounded bg-neutral-200 mb-2.5">
                          <img
                            src={featuredMegaItem.images[0]}
                            alt={featuredMegaItem.title}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                            Staff Pick
                          </span>
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                            {featuredMegaItem.title}
                          </h4>
                          <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">
                            {formatPrice(featuredMegaItem.price)}
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('collections')}
                  className={`py-2 hover:text-neutral-900 transition-colors ${
                    currentPage === 'collections' ? 'text-neutral-900 font-bold' : ''
                  }`}
                >
                  Collections
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className={`py-2 hover:text-neutral-900 transition-colors ${
                    currentPage === 'about' ? 'text-neutral-900 font-bold' : ''
                  }`}
                >
                  About
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className={`py-2 hover:text-neutral-900 transition-colors ${
                    currentPage === 'contact' ? 'text-neutral-900 font-bold' : ''
                  }`}
                >
                  Contact
                </button>
              </nav>
            </div>

            {/* Center: Store Name / Logo */}
            <div className="text-center justify-self-center">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="group focus:outline-hidden text-center"
              >
                <span className="text-xl sm:text-2xl font-black tracking-widest text-neutral-900 font-heading block">
                  {storeConfig.storeName}
                </span>
                <span className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-neutral-400 -mt-1 font-sans group-hover:text-neutral-600 transition-colors">
                  Studio Storefront
                </span>
              </button>
            </div>

            {/* Right: Actions (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center gap-1 sm:gap-1.5 justify-self-end">
              {/* Search button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account button */}
              <button
                type="button"
                onClick={() => setIsAccountOpen(true)}
                aria-label="Customer account"
                className="p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Wishlist button */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                aria-label="Wishlist"
                className="relative p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart button with bump animation */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping bag"
                className="relative p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className={`absolute top-1.5 right-1.5 w-4 h-4 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs ${
                      cartBumping ? 'animate-cart-bump' : ''
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
