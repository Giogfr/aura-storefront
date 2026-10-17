import React from 'react';
import { useStore } from '../context/StoreContext';
import { categoriesData } from '../data/storeConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FALLBACK_COLLECTION_IMAGE } from '../lib/images';

export const CollectionsPage: React.FC = () => {
  const { navigateTo } = useStore();

  const fallbackImage = FALLBACK_COLLECTION_IMAGE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <Breadcrumbs items={[{ label: 'Collections' }]} />

      <div className="py-8 sm:py-12 text-center max-w-2xl mx-auto border-b border-neutral-200">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 text-[11px] font-semibold tracking-widest uppercase rounded-full mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Curated Disciplines</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 font-heading mb-3">
          All Collections
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          From Japanese loomed textiles and Tuscan cordwaining to wheel-thrown ceramics and acoustic engineering. Explore each category capsule.
        </p>
      </div>

      {/* Grid of collections */}
      <div className="pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categoriesData.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => navigateTo('shop', { categoryId: category.id })}
            className="group relative cursor-pointer overflow-hidden rounded-lg bg-neutral-900 aspect-[4/5] flex flex-col justify-end p-6 sm:p-8 shadow-xs text-left focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            {/* Background Image */}
            <img
              src={category.image}
              alt={category.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-65 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="relative z-10 space-y-2 text-white">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                {category.productCount} Products
              </span>
              <span className="block text-2xl font-bold font-heading">
                {category.name}
              </span>
              <span className="block text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                {category.description}
              </span>
              <span className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
