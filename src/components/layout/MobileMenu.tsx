import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { categoriesData, storeConfig } from '../../data/storeConfig';
import { PageType, RouteParams } from '../../types';
import { X, ChevronRight, Search, Heart, User } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { navigateTo, setIsSearchOpen, setIsAccountOpen, setIsWishlistOpen, wishlistCount } = useStore();
  const [shopExpanded, setShopExpanded] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNav = (page: PageType, params?: RouteParams) => {
    onClose();
    navigateTo(page, params);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-lg font-black tracking-widest text-neutral-900 font-heading">
            {storeConfig.storeName}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search shortcut */}
        <div className="p-4 border-b border-neutral-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              setIsSearchOpen(true);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-neutral-100 text-neutral-500 rounded text-xs hover:bg-neutral-200/80 transition-colors"
          >
            <Search className="w-4 h-4 text-neutral-400" />
            <span>Search products, categories...</span>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div>
            <button
              type="button"
              onClick={() => setShopExpanded(!shopExpanded)}
              aria-expanded={shopExpanded}
              className="w-full flex items-center justify-between py-2.5 text-sm font-bold text-neutral-900 hover:text-neutral-600"
            >
              <span>Shop Catalog</span>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  shopExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>

            {shopExpanded && (
              <div className="pl-3 pb-2 space-y-2 border-l-2 border-neutral-100 ml-1 mt-1">
                <button
                  type="button"
                  onClick={() => handleNav('shop')}
                  className="block text-xs font-semibold text-neutral-900 hover:underline py-1"
                >
                  All Products →
                </button>
                {categoriesData.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleNav('shop', { categoryId: cat.id })}
                    className="block text-xs text-neutral-600 hover:text-neutral-900 py-1"
                  >
                    {cat.name} ({cat.productCount})
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNav('collections')}
            className="w-full text-left py-2.5 text-sm font-semibold text-neutral-900 hover:text-neutral-600"
          >
            Collections Overview
          </button>

          <button
            type="button"
            onClick={() => handleNav('about')}
            className="w-full text-left py-2.5 text-sm font-semibold text-neutral-900 hover:text-neutral-600"
          >
            About Our Studio
          </button>

          <button
            type="button"
            onClick={() => handleNav('contact')}
            className="w-full text-left py-2.5 text-sm font-semibold text-neutral-900 hover:text-neutral-600"
          >
            Contact & Support
          </button>

          <button
            type="button"
            onClick={() => handleNav('faq')}
            className="w-full text-left py-2.5 text-sm font-semibold text-neutral-900 hover:text-neutral-600"
          >
            Frequently Asked Questions
          </button>

          <button
            type="button"
            onClick={() => handleNav('shipping-returns')}
            className="w-full text-left py-2.5 text-sm font-semibold text-neutral-900 hover:text-neutral-600"
          >
            Shipping & Returns Policy
          </button>
        </div>

        {/* Footer shortcuts */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsWishlistOpen(true);
              }}
              className="flex items-center justify-center gap-2 p-2.5 bg-white border border-neutral-200 rounded text-xs font-semibold text-neutral-800"
            >
              <Heart className="w-3.5 h-3.5 text-neutral-500" />
              <span>Wishlist ({wishlistCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                setIsAccountOpen(true);
              }}
              className="flex items-center justify-center gap-2 p-2.5 bg-white border border-neutral-200 rounded text-xs font-semibold text-neutral-800"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Account</span>
            </button>
          </div>

          <div className="text-[11px] text-neutral-500 pt-2 text-center">
            <span>Customer Care: {storeConfig.contactPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
