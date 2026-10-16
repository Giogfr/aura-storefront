import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { productsData } from '../../data/products';
import { categoriesData } from '../../data/storeConfig';
import { Search, X, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

export const SearchOverlay: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    navigateTo,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    formatPrice,
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Enhanced tokenized search matching
  const matchingProducts = query.trim()
    ? productsData.filter((p) => {
        const tokens = query.toLowerCase().trim().split(/\s+/);
        const searchableText = `${p.title} ${p.categoryName} ${p.category} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
        return tokens.every((token) => searchableText.includes(token));
      }).slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query.trim());
    setIsSearchOpen(false);
    navigateTo('search', { searchQuery: query.trim() });
  };

  const handleCategoryClick = (categoryId: string) => {
    setIsSearchOpen(false);
    navigateTo('shop', { categoryId });
  };

  const handleProductClick = (productId: string) => {
    setIsSearchOpen(false);
    navigateTo('product', { productId });
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white/98 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Product Search"
    >
      {/* Search Header Bar */}
      <div className="border-b border-neutral-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 shrink-0" />
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, materials, collections..."
              className="w-full text-lg sm:text-2xl font-medium text-neutral-900 placeholder:text-neutral-300 focus:outline-hidden bg-transparent"
              aria-label="Search field"
            />
          </form>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Body Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {!query.trim() ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          addRecentSearch(term);
                          setIsSearchOpen(false);
                          navigateTo('search', { searchQuery: term });
                        }}
                        className="px-3.5 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Browse Categories
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {categoriesData.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className="flex items-center justify-between p-3 rounded bg-neutral-50 hover:bg-neutral-100 text-left transition-colors border border-neutral-200/60 group"
                    >
                      <span className="text-xs font-medium text-neutral-900 group-hover:underline">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {cat.productCount} items
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {matchingProducts.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Matching Products ({matchingProducts.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                    >
                      <span>View All Results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {matchingProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductClick(product.id)}
                        className="flex gap-3 p-2.5 rounded-lg border border-neutral-200/80 hover:border-neutral-900 hover:shadow-xs cursor-pointer transition-all bg-white group text-left w-full"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackImage;
                          }}
                          className="w-18 h-22 object-cover rounded shrink-0 bg-neutral-100"
                        />
                        <div className="flex flex-col justify-center overflow-hidden">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                            {product.categoryName}
                          </span>
                          <h4 className="text-xs font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors truncate">
                            {product.title}
                          </h4>
                          <span className="text-xs font-bold text-neutral-900 mt-1">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-2 shadow-xs min-h-[44px]"
                    >
                      <span>See full search results for "{query}"</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-1">
                    No results found for "{query}"
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6 leading-relaxed">
                    Try checking for typos or searching for broader terms like "coat", "shoes", "linen", or "accessories".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('shop');
                    }}
                    className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
                  >
                    View All Products
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
