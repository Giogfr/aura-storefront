import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';
import { categoriesData } from '../data/storeConfig';
import { ProductGrid } from '../components/common/ProductGrid';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FilterState } from '../types';
import {
  SlidersHorizontal,
  X,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  Check,
  RotateCcw,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { routeParams, formatPrice } = useStore();

  const initialCategory = routeParams.categoryId || 'all';

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    priceRange: [0, 450],
    colors: [],
    sizes: [],
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'featured',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [columns, setColumns] = useState<2 | 3 | 4>(4);
  const [displayLimit, setDisplayLimit] = useState(12);

  // Sync category from routeParams if changed
  useEffect(() => {
    const categoryId = routeParams.categoryId;
    if (categoryId) {
      setFilters((prev) => ({ ...prev, category: categoryId }));
    }
  }, [routeParams.categoryId]);

  // Apply a curated deep-link (mega menu / editorial links) as a one-shot filter
  const curationFilter = routeParams.curationFilter;
  useEffect(() => {
    if (!curationFilter) return;
    setFilters((prev) => {
      if (curationFilter === 'sale') return { ...prev, onSaleOnly: true };
      if (curationFilter === 'new') return { ...prev, sortBy: 'newest' };
      return { ...prev, sortBy: 'rating' };
    });
  }, [curationFilter]);

  const curationLabel =
    curationFilter === 'sale'
      ? 'Archive Sale'
      : curationFilter === 'new'
        ? 'New Season Arrivals'
        : curationFilter === 'bestseller'
          ? 'Bestselling Staples'
          : null;

  // Handle escape key and body scroll lock for mobile filter drawer
  useEffect(() => {
    if (!mobileFilterOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileFilterOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileFilterOpen]);

  // Determine collection metadata
  const currentCategoryData = categoriesData.find((c) => c.id === filters.category);
  const pageTitle = currentCategoryData ? currentCategoryData.name : 'All Products';
  const pageDescription = currentCategoryData
    ? currentCategoryData.description
    : 'Explore our complete catalog of consciously designed garments, footwear, ceramics, and everyday tools.';

  // Available unique colors and sizes from products
  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    productsData.forEach((p) => {
      p.colors.forEach((c) => map.set(c.name, c.hex));
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'US 8', 'US 9', 'US 10', 'US 11'];

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return productsData
      .filter((product) => {
        // Category
        if (filters.category !== 'all' && product.category !== filters.category) {
          return false;
        }
        // Price
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
          return false;
        }
        // In stock only
        if (filters.inStockOnly && !product.inStock) {
          return false;
        }
        // On sale only
        if (filters.onSaleOnly && !product.isSale) {
          return false;
        }
        // Colors
        if (filters.colors.length > 0) {
          const hasColor = product.colors.some((c) => filters.colors.includes(c.name));
          if (!hasColor) return false;
        }
        // Sizes
        if (filters.sizes.length > 0) {
          const hasSize = product.sizes?.some((s) => filters.sizes.includes(s.label));
          if (!hasSize) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          case 'featured':
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [filters]);

  const displayedProducts = filteredProducts.slice(0, displayLimit);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 450],
      colors: [],
      sizes: [],
      inStockOnly: false,
      onSaleOnly: false,
      sortBy: 'featured',
    });
  };

  const toggleColor = (colorName: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName],
    }));
  };

  const toggleSize = (sizeLabel: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(sizeLabel)
        ? prev.sizes.filter((s) => s !== sizeLabel)
        : [...prev.sizes, sizeLabel],
    }));
  };

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    filters.colors.length +
    filters.sizes.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 450 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <Breadcrumbs items={[{ label: 'Catalog', page: 'shop' }, { label: pageTitle }]} />

      {/* Collection Header */}
      <div className="py-6 sm:py-8 border-b border-neutral-200">
        <div className="max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            {curationLabel ? `Curated \u00b7 ${curationLabel}` : 'Collection Directory'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-2">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            {pageDescription}
          </p>
        </div>
      </div>

      {/* Control Bar: Filter Button, Active Chips, Sort, Grid Column Toggle */}
      <div className="py-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200">
        {/* Left: Mobile Filter Trigger & Product Count */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded transition-colors min-h-[44px]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <span className="text-xs font-medium text-neutral-500">
            Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {/* Right: Grid Switcher & Sort Selector */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Column switcher (desktop) */}
          <div className="hidden sm:flex items-center gap-1 border border-neutral-200 p-0.5 rounded">
            <button
              type="button"
              onClick={() => setColumns(2)}
              title="2 Columns"
              aria-label="2 Columns per row"
              className={`p-1.5 rounded transition-colors ${
                columns === 2 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setColumns(3)}
              title="3 Columns"
              aria-label="3 Columns per row"
              className={`p-1.5 rounded transition-colors ${
                columns === 3 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setColumns(4)}
              title="4 Columns"
              aria-label="4 Columns per row"
              className={`p-1.5 rounded transition-colors ${
                columns === 4 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-neutral-400 font-medium">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
              aria-label="Sort products by"
              className="text-xs font-medium bg-transparent border border-neutral-200 rounded px-2.5 py-2 text-neutral-800 focus:outline-hidden focus:border-neutral-900 cursor-pointer min-h-[40px]"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-3 border-b border-neutral-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Active:
          </span>

          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
              Category: {currentCategoryData?.name}
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                aria-label={`Remove category ${currentCategoryData?.name}`}
                className="hover:text-rose-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
              In Stock Only
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))}
                aria-label="Remove in stock only filter"
                className="hover:text-rose-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.onSaleOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
              On Sale
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, onSaleOnly: false }))}
                aria-label="Remove on sale filter"
                className="hover:text-rose-900 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.colors.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
            >
              Color: {color}
              <button
                type="button"
                onClick={() => toggleColor(color)}
                aria-label={`Remove color ${color}`}
                className="hover:text-rose-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.sizes.map((size) => (
            <span
              key={size}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
            >
              Size: {size}
              <button
                type="button"
                onClick={() => toggleSize(size)}
                aria-label={`Remove size ${size}`}
                className="hover:text-rose-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 450) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
              {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, priceRange: [0, 450] }))}
                aria-label="Remove price range filter"
                className="hover:text-rose-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline font-medium ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar Filter Layout */}
      <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 pr-4 border-r border-neutral-200">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Filter By
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-neutral-400 hover:text-neutral-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-900 block mb-1">
              Category
            </span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                className={`w-full text-left text-xs py-1 flex items-center justify-between transition-colors ${
                  filters.category === 'all'
                    ? 'font-bold text-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>All Products</span>
                <span className="text-[11px] text-neutral-400">{productsData.length}</span>
              </button>
              {categoriesData.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                  className={`w-full text-left text-xs py-1 flex items-center justify-between transition-colors ${
                    filters.category === cat.id
                      ? 'font-bold text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[11px] text-neutral-400">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability & Sale toggles */}
          <div className="pt-4 border-t border-neutral-100 space-y-2.5">
            <span className="text-xs font-semibold text-neutral-900 block">
              Availability
            </span>
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-3.5 h-3.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span>In stock items only</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, onSaleOnly: e.target.checked }))}
                className="w-3.5 h-3.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span className="text-rose-600 font-medium">On Sale / Archive Price</span>
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-900">Price Range</span>
              <span className="text-neutral-500 font-medium">
                {formatPrice(filters.priceRange[0])} – {formatPrice(filters.priceRange[1])}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={450}
              step={10}
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], parseInt(e.target.value, 10)],
                }))
              }
              aria-label="Maximum price filter"
              className="w-full accent-neutral-900 cursor-pointer"
            />
          </div>

          {/* Color Swatch Filters */}
          <div className="pt-4 border-t border-neutral-100 space-y-2.5">
            <span className="text-xs font-semibold text-neutral-900 block">Color</span>
            <div className="grid grid-cols-4 gap-2">
              {allColors.slice(0, 8).map(({ name, hex }) => {
                const selected = filters.colors.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleColor(name)}
                    title={name}
                    aria-label={`Filter by color ${name}`}
                    className={`h-7 rounded-md border flex items-center justify-center transition-all ${
                      selected
                        ? 'ring-2 ring-neutral-900 border-white'
                        : 'border-neutral-200 hover:border-neutral-500'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Filter Pills */}
          <div className="pt-4 border-t border-neutral-100 space-y-2.5">
            <span className="text-xs font-semibold text-neutral-900 block">Sizes</span>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((size) => {
                const selected = filters.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    aria-label={`Filter by size ${size}`}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      selected
                        ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-800'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9">
          <ProductGrid
            products={displayedProducts}
            columns={columns}
            onResetFilters={handleResetFilters}
          />

          {/* Load More Button */}
          {filteredProducts.length > displayLimit && (
            <div className="mt-14 text-center">
              <p className="text-xs text-neutral-500 mb-3">
                Viewing {displayedProducts.length} of {filteredProducts.length} products
              </p>
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => prev + 8)}
                className="px-8 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider rounded transition-colors min-h-[44px]"
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-right">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-900"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Categories */}
              <div>
                <span className="text-xs font-bold text-neutral-900 block mb-2">Category</span>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                    className={`block text-xs ${filters.category === 'all' ? 'font-bold text-neutral-900' : 'text-neutral-600'}`}
                  >
                    All Categories
                  </button>
                  {categoriesData.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFilters((p) => ({ ...p, category: cat.id }))}
                      className={`block text-xs ${filters.category === cat.id ? 'font-bold text-neutral-900' : 'text-neutral-600'}`}
                    >
                      {cat.name} ({cat.productCount})
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div className="space-y-2 pt-4 border-t border-neutral-100">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilters((p) => ({ ...p, inStockOnly: e.target.checked }))}
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={filters.onSaleOnly}
                    onChange={(e) => setFilters((p) => ({ ...p, onSaleOnly: e.target.checked }))}
                  />
                  <span className="text-rose-600 font-semibold">Sale Items</span>
                </label>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-neutral-100">
                <span className="text-xs font-bold text-neutral-900 block mb-2">
                  Max Price: {formatPrice(filters.priceRange[1])}
                </span>
                <input
                  type="range"
                  min={0}
                  max={450}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, priceRange: [0, parseInt(e.target.value, 10)] }))
                  }
                  aria-label="Mobile maximum price slider"
                  className="w-full accent-neutral-900"
                />
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-neutral-300 text-xs font-semibold rounded text-neutral-700 min-h-[44px]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded min-h-[44px]"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
