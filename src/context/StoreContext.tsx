import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { PageType, RouteParams, Product, CartItem, CurrencyOption } from '../types';
import { productsData } from '../data/products';
import { storeConfig } from '../data/storeConfig';
import {
  formatCurrencyAmount,
  getAvailableStock,
  parseRoute,
  resolvePromoCode,
  sanitizeCart,
  sanitizeWishlist,
  TAX_RATE,
} from '../lib/storeUtils';

// Static, illustrative conversion rates for the demo — NOT live exchange rates.
export const availableCurrencies: CurrencyOption[] = [
  { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', rate: 0.78, label: 'GBP (£)' },
  { code: 'CAD', symbol: 'CA$', rate: 1.36, label: 'CAD ($)' },
  { code: 'AUD', symbol: 'AU$', rate: 1.52, label: 'AUD ($)' },
];

interface ToastState {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface StoreContextValue {
  // Navigation
  currentPage: PageType;
  routeParams: RouteParams;
  navigateTo: (page: PageType, params?: RouteParams, pushHistory?: boolean) => void;

  // Currency & Localization
  activeCurrency: CurrencyOption;
  setActiveCurrency: (currency: CurrencyOption) => void;
  availableCurrencies: CurrencyOption[];
  formatPrice: (amount: number) => string;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartBumping: boolean;
  recentlyAddedId: string | null;
  cartSubtotal: number;
  cartDiscountAmount: number;
  cartShippingFee: number;
  cartTaxAmount: number;
  cartTotal: number;
  discountCode: string;
  discountRate: number;
  discountPercent: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Account
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  user: { name: string; email: string; loggedIn: boolean } | null;
  loginUser: (email: string, name: string) => void;
  logoutUser: () => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (productId: string) => void;

  // Toast
  toasts: ToastState[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [routeParams, setRouteParams] = useState<RouteParams>({});

  // Currency & Localization state
  const [activeCurrency, setActiveCurrency] = useState<CurrencyOption>(availableCurrencies[0]);

  // Micro-interaction states
  const [cartBumping, setCartBumping] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const formatPrice = useCallback(
    (amount: number): string => formatCurrencyAmount(amount, activeCurrency),
    [activeCurrency]
  );

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const local = localStorage.getItem('aura_cart');
      return local ? sanitizeCart(JSON.parse(local)) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<number>(0);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('aura_wishlist');
      return local ? sanitizeWishlist(JSON.parse(local)) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Account Modal
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; loggedIn: boolean } | null>(null);

  // Recently Viewed
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const toastIdRef = useRef(0);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Read URL parameters on mount
  useEffect(() => {
    const handleUrlChange = () => {
      const { page, params } = parseRoute(window.location.search);
      setCurrentPage(page);
      setRouteParams(params);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigateTo = useCallback((page: PageType, params: RouteParams = {}, pushHistory = true) => {
    setCurrentPage(page);
    setRouteParams(params);

    if (pushHistory) {
      const query = new URLSearchParams();
      if (page !== 'home') query.set('page', page);
      if (params.productId) query.set('id', params.productId);
      if (params.categoryId) query.set('cat', params.categoryId);
      if (params.searchQuery) query.set('q', params.searchQuery);
      if (params.curationFilter) query.set('filter', params.curationFilter);

      const queryString = query.toString();
      const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'success') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Cart operations
  const addToCart = useCallback(
    (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
      const available = getAvailableStock(product);
      if (available <= 0) {
        showToast(`"${product.title}" is currently sold out`, 'warning');
        return;
      }

      const requested = Math.max(1, Math.floor(quantity));
      const color = selectedColor || (product.colors.length > 0 ? product.colors[0].name : undefined);
      const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0].label : undefined);
      const itemId = `${product.id}-${color || 'default'}-${size || 'default'}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === itemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            maxStock: available,
            quantity: Math.min(updated[existingIndex].quantity + requested, available),
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: itemId,
            productId: product.id,
            title: product.title,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: product.images[0],
            selectedColor: color,
            selectedSize: size,
            quantity: Math.min(requested, available),
            maxStock: available,
            product,
          },
        ];
      });

      setRecentlyAddedId(product.id);
      setTimeout(() => setRecentlyAddedId(null), 2200);
      setCartBumping(true);
      setTimeout(() => setCartBumping(false), 450);

      showToast(`Added "${product.title}" to your cart`, 'success');
      setIsCartOpen(true);
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      showToast('Item removed from cart', 'info');
    },
    [showToast]
  );

  const updateQuantity = useCallback((itemId: string, newQty: number) => {
    if (!Number.isFinite(newQty)) return;
    const next = Math.floor(newQty);
    if (next <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: Math.min(next, item.maxStock) } : item))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const applyDiscount = useCallback((code: string) => {
    const result = resolvePromoCode(code);
    if (result.success) {
      setDiscountCode(result.code);
      setDiscountRate(result.rate);
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  }, []);

  const removeDiscount = useCallback(() => {
    setDiscountCode('');
    setDiscountRate(0);
  }, []);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartDiscountAmount = useMemo(() => {
    return Math.round(cartSubtotal * discountRate * 100) / 100;
  }, [cartSubtotal, discountRate]);

  const cartShippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (discountCode === 'FREESHIP' || cartSubtotal >= storeConfig.freeShippingThreshold) {
      return 0;
    }
    return storeConfig.standardShippingFee;
  }, [cartSubtotal, discountCode]);

  const cartTaxAmount = useMemo(() => {
    return Math.round((cartSubtotal - cartDiscountAmount) * TAX_RATE * 100) / 100;
  }, [cartSubtotal, cartDiscountAmount]);

  // Amount due: discounted merchandise + shipping + estimated tax.
  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscountAmount + cartShippingFee + cartTaxAmount);
  }, [cartSubtotal, cartDiscountAmount, cartShippingFee, cartTaxAmount]);

  const discountPercent = Math.round(discountRate * 100);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Wishlist operations
  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast('Removed from wishlist', 'info');
          return prev.filter((id) => id !== productId);
        } else {
          showToast('Saved to your wishlist', 'success');
          return [...prev, productId];
        }
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  // Quick View
  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  // Recent Searches
  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  // Account
  const loginUser = useCallback(
    (email: string, name: string) => {
      setUser({ email, name, loggedIn: true });
      showToast(`Welcome back, ${name}!`, 'success');
      setIsAccountOpen(false);
    },
    [showToast]
  );

  const logoutUser = useCallback(() => {
    setUser(null);
    showToast('You have signed out', 'info');
  }, [showToast]);

  // Recently Viewed
  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 6));
  }, []);

  const recentlyViewed = useMemo(() => {
    return recentlyViewedIds.map((id) => productsData.find((p) => p.id === id)).filter(Boolean) as Product[];
  }, [recentlyViewedIds]);

  // Global escape key listener to close active drawers/modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsWishlistOpen(false);
        setIsSearchOpen(false);
        setIsAccountOpen(false);
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when any drawer or modal is open
  useEffect(() => {
    const isAnyModalOpen = isCartOpen || isWishlistOpen || isSearchOpen || isAccountOpen || !!quickViewProduct;
    if (isAnyModalOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isCartOpen, isWishlistOpen, isSearchOpen, isAccountOpen, quickViewProduct]);

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        routeParams,
        navigateTo,

        activeCurrency,
        setActiveCurrency,
        availableCurrencies,
        formatPrice,

        cart,
        cartCount,
        cartBumping,
        recentlyAddedId,
        cartSubtotal,
        cartDiscountAmount,
        cartShippingFee,
        cartTaxAmount,
        cartTotal,
        discountCode,
        discountRate,
        discountPercent,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyDiscount,
        removeDiscount,
        clearCart,

        wishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        isInWishlist,

        quickViewProduct,
        openQuickView,
        closeQuickView,

        isSearchOpen,
        setIsSearchOpen,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,

        isAccountOpen,
        setIsAccountOpen,
        user,
        loginUser,
        logoutUser,

        recentlyViewed,
        addRecentlyViewed,

        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextValue => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
