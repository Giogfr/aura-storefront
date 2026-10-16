import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';
import { ProductGrid } from '../components/common/ProductGrid';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Search, ArrowRight } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const { routeParams, navigateTo } = useStore();
  const initialQuery = routeParams.searchQuery || '';
  const [query, setQuery] = useState(initialQuery);

  const trimmed = query.trim().toLowerCase();

  const results = productsData.filter((p) => {
    if (!trimmed) return true;
    return (
      p.title.toLowerCase().includes(trimmed) ||
      p.categoryName.toLowerCase().includes(trimmed) ||
      p.description.toLowerCase().includes(trimmed) ||
      p.tags.some((t) => t.toLowerCase().includes(trimmed))
    );
  });

  const popularSearches = ['Linen', 'Wool', 'Boots', 'Ceramic', 'Backpack', 'Minimalist'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      <div className="py-8 sm:py-12 max-w-2xl mx-auto text-center border-b border-neutral-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif-heading mb-4">
          Search Storefront
        </h1>

        {/* Input Bar */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, items, or materials..."
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 shadow-2xs"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full text-[11px] transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="py-6 flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500">
          Found <strong className="text-neutral-900">{results.length}</strong> results for "{query}"
        </p>
      </div>

      {/* Grid or Empty */}
      {results.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto">
          <p className="text-sm font-semibold text-neutral-800 mb-2">No items matched your search.</p>
          <p className="text-xs text-neutral-500 mb-6">
            Try checking for spelling errors or searching for broader categories like "Apparel", "Footwear", or "Living".
          </p>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <ProductGrid products={results} columns={4} />
      )}
    </div>
  );
};
