import React from 'react';
import { useStore } from '../context/StoreContext';
import { storeConfig } from '../data/storeConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ArrowRight, Leaf, Shield, HeartHandshake, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-16">
      <Breadcrumbs items={[{ label: 'About Our Studio' }]} />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Philosophy & Provenance
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 font-heading leading-tight">
          Quiet Luxury Crafted for the Considered Life
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Founded on the conviction that everyday objects should possess enduring integrity, {storeConfig.storeName} bridges functional minimalism with artisanal manufacturing. We partner with legacy European and Japanese mills to build pieces intended to age with grace.
        </p>
      </section>

      {/* Editorial Image Collage */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100">
          <img
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
            alt="Studio workbench"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100 md:translate-y-6">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
            alt="Textile loom"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100">
          <img
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
            alt="Ceramic workshop"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Core Pillars */}
      <section className="pt-12 border-t border-neutral-200">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Our Commitments
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-heading">
            Four Foundational Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Organic & Traceable</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Every cotton thread is GOTS-certified organic, and our leather goods utilize vegetable-tanned hides audited by the Leather Working Group.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Generational Durability</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              We design against obsolescence. Double-needle lockstitching and reinforced seams ensure each garment withstands years of regular rotation.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Direct Mill Partnerships</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              By working directly with master artisans in Portugal, Italy, and Japan, we avoid distributor markups and support multi-generational craft families.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Zero-Waste Packaging</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Our shipping mailers, paper tapes, and hangtags are 100% post-consumer recycled and curbside compostable. No plastic polybags.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-heading">
          Explore the Current Capsule
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
          Discover modern essentials tailored from organic linen, heavyweight French terry, and Tuscan leather.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
        >
          <span>Shop the Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
