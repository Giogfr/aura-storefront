import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  onResetFilters?: () => void;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = 4,
  onResetFilters,
  isLoading = false,
}) => {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading products"
        className={`grid ${columnClasses} gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-3">
            <div className="bg-neutral-200 aspect-[3/4] w-full rounded-sm" />
            <div className="h-3 bg-neutral-200 w-1/3 rounded" />
            <div className="h-4 bg-neutral-200 w-3/4 rounded" />
            <div className="h-4 bg-neutral-200 w-1/4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">No products found</h3>
        <p className="text-sm text-neutral-500 mb-6">
          We couldn't find any products matching your current filters or search term. Try adjusting your selections.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${columnClasses} gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
