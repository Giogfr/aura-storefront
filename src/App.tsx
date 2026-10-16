import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { storeConfig } from './data/storeConfig';
import { productsData } from './data/products';
import { PageType } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { CartDrawer } from './components/common/CartDrawer';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SearchOverlay } from './components/common/SearchOverlay';
import { AccountModal } from './components/common/AccountModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductPage } from './pages/ProductPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

const PAGE_TITLES: Partial<Record<PageType, string>> = {
  shop: 'Shop All',
  collections: 'Collections',
  search: 'Search',
  cart: 'Shopping Bag',
  checkout: 'Checkout',
  about: 'About',
  contact: 'Contact',
  faq: 'Frequently Asked Questions',
  'shipping-returns': 'Shipping & Returns',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Conditions',
};

const StorefrontApp: React.FC = () => {
  const { currentPage, routeParams } = useStore();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Keep the document title in sync with the active view
  useEffect(() => {
    const base = storeConfig.storeName;
    let title: string;

    if (currentPage === 'home') {
      title = `${base} — Modern Ecommerce Storefront Template`;
    } else if (currentPage === 'product') {
      const product = productsData.find((p) => p.id === routeParams.productId);
      title = `${product ? product.title : 'Product'} — ${base}`;
    } else {
      title = `${PAGE_TITLES[currentPage] ?? 'Page Not Found'} — ${base}`;
    }

    document.title = title;
  }, [currentPage, routeParams.productId]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'collections':
        return <CollectionsPage />;
      case 'product':
        return <ProductPage />;
      case 'search':
        return <SearchResultsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      case 'shipping-returns':
        return <ShippingReturnsPage />;
      case 'privacy-policy':
        return <LegalPage initialTab="privacy" />;
      case 'terms':
        return <LegalPage initialTab="terms" />;
      default:
        return <NotFoundPage />;
    }
  };

  const isCheckout = currentPage === 'checkout';

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Global Overlays & Modals */}
      <Toast />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <SearchOverlay />
      <AccountModal />

      {/* Main Layout Header (distraction-free on checkout) */}
      {!isCheckout && <Header />}

      {/* Active Page View */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Main Layout Footer (hidden on checkout) */}
      {!isCheckout && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontApp />
    </StoreProvider>
  );
}
