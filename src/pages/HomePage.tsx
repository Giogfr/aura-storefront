import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { categoriesData, storeBenefits, promoBanners, instagramPosts } from '../data/storeConfig';
import { productsData } from '../data/products';
import { ProductGrid } from '../components/common/ProductGrid';
import {
  ArrowRight,
  Truck,
  RefreshCw,
  ShieldCheck,
  Headphones,
  Instagram,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo } = useStore();
  const [featuredTab, setFeaturedTab] = useState<string>('all');

  const featuredProducts = productsData.filter((p) => p.isFeatured);
  const newArrivals = productsData.filter((p) => p.isNewArrival);
  const bestSellers = productsData.filter((p) => p.isBestSeller).slice(0, 4);

  const fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop';

  const filteredFeatured =
    featuredTab === 'all'
      ? featuredProducts.slice(0, 8)
      : featuredProducts.filter((p) => p.category === featuredTab);

  const getBenefitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-6 h-6 text-neutral-900" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6 text-neutral-900" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-neutral-900" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-neutral-900" />;
      default:
        return <Sparkles className="w-6 h-6 text-neutral-900" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Large Hero Banner */}
      <section className="relative w-full min-h-[580px] sm:min-h-[680px] flex items-center bg-neutral-900 overflow-hidden">
        {/* Hero Background Image with Subtle Film Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={promoBanners.hero.image}
            alt="Hero Banner"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
            className="w-full h-full object-cover object-center opacity-65 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl space-y-6 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold tracking-widest uppercase rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{promoBanners.hero.badge}</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight font-serif-heading">
              {promoBanners.hero.title}
            </h1>

            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
              {promoBanners.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigateTo('shop')}
                className="px-7 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider rounded transition-all duration-200 shadow-lg flex items-center gap-2 min-h-[44px]"
              >
                <span>{promoBanners.hero.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('collections')}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider rounded transition-all duration-200 min-h-[44px]"
              >
                Browse Collections
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop By Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Curated Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif-heading">
              Shop by Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('collections')}
            className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group p-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigateTo('shop', { categoryId: cat.id })}
              className="group cursor-pointer flex flex-col text-left focus:outline-hidden focus:ring-2 focus:ring-neutral-900 rounded p-1"
            >
              <div className="relative aspect-[4/5] rounded overflow-hidden bg-neutral-100 mb-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900 group-hover:underline">
                {cat.name}
              </h3>
              <span className="text-[11px] text-neutral-400 font-medium">
                {cat.productCount} Items
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Products with Interactive Category Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif-heading">
              Featured Products
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'apparel', label: 'Apparel' },
              { id: 'footwear', label: 'Footwear' },
              { id: 'accessories', label: 'Accessories' },
              { id: 'home', label: 'Home' },
              { id: 'tech', label: 'Tech' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFeaturedTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                  featuredTab === tab.id
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid products={filteredFeatured} columns={4} />

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors min-h-[44px]"
          >
            Explore Complete Catalog
          </button>
        </div>
      </section>

      {/* 4. Promotional Split Editorial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-100 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center shadow-2xs">
          <div className="lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:h-[480px] w-full overflow-hidden">
            <img
              src={promoBanners.editorial.image}
              alt="Editorial lookbook"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block">
              {promoBanners.editorial.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif-heading leading-snug">
              {promoBanners.editorial.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {promoBanners.editorial.description}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigateTo('about')}
                className="px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-2 min-h-[44px]"
              >
                <span>{promoBanners.editorial.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Just Released
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif-heading">
              New Season Arrivals
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('shop', { searchQuery: 'new' })}
            className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group p-1"
          >
            <span>View All New</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <ProductGrid products={newArrivals.slice(0, 4)} columns={4} />
      </section>

      {/* 6. Bestsellers Highlight */}
      <section className="bg-neutral-50 py-16 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif-heading">
              Our Bestselling Staples
            </h2>
            <p className="text-xs text-neutral-500 mt-2">
              The everyday pieces our community returns to again and again. Built to endure decades of dependable service.
            </p>
          </div>

          <ProductGrid products={bestSellers} columns={4} />
        </div>
      </section>

      {/* 7. Large Collection Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-lg overflow-hidden min-h-[420px] flex items-center bg-neutral-900 shadow-2xs">
          <img
            src={promoBanners.largeCollectionBanner.image}
            alt="Collection Banner"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 p-8 sm:p-14 max-w-lg space-y-4 text-white">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              {promoBanners.largeCollectionBanner.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif-heading">
              {promoBanners.largeCollectionBanner.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-200">
              {promoBanners.largeCollectionBanner.subtitle}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigateTo('shop', { categoryId: promoBanners.largeCollectionBanner.categoryTarget })}
                className="px-7 py-3.5 bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <span>{promoBanners.largeCollectionBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Store Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-neutral-200">
          {storeBenefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-4 p-2">
              <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                {getBenefitIcon(benefit.icon)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 mb-1">{benefit.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Instagram / Social Community UGC Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-8">
          <div className="flex items-center justify-center gap-1.5 text-neutral-900 mb-1">
            <Instagram className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">@aura.studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-serif-heading">
            Seen in Daily Life
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Tag #AuraEveryday on Instagram to be featured in our seasonal lookbook gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramPosts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => navigateTo('product', { productId: post.productId })}
              className="group relative block w-full aspect-square rounded overflow-hidden bg-neutral-100 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-neutral-900 text-left p-0"
            >
              <img
                src={post.image}
                alt={post.caption}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                <p className="text-[10px] leading-tight line-clamp-2 mb-1">{post.caption}</p>
                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1">
                  <ShoppingBag className="w-2.5 h-2.5" />
                  <span>Shop Look</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
