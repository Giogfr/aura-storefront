import React from 'react';
import { useStore } from '../context/StoreContext';
import { categoriesData } from '../data/storeConfig';
import { ArrowRight, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-28 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-6">
        <Compass className="w-8 h-8 text-neutral-700" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 font-heading mb-3">
        Page Not Found
      </h1>

      <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for may have been retired, renamed, or is temporarily unavailable in our seasonal rotation.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="px-6 py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
        >
          Return to Home
        </button>

        <button
          type="button"
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded hover:border-neutral-900 transition-colors"
        >
          Browse All Products
        </button>
      </div>

      {/* Popular category shortcuts */}
      <div className="pt-10 border-t border-neutral-200">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-4">
          Or explore curated collections:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigateTo('shop', { categoryId: cat.id })}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-full transition-colors flex items-center gap-1"
            >
              <span>{cat.name}</span>
              <ArrowRight className="w-3 h-3 text-neutral-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
