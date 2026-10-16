import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { storeConfig } from '../data/storeConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy' }) => {
  const { currentPage } = useStore();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(
    currentPage === 'terms' ? 'terms' : initialTab
  );

  useEffect(() => {
    if (currentPage === 'privacy-policy' || currentPage === 'terms') {
      setActiveTab(currentPage === 'terms' ? 'terms' : 'privacy');
    }
  }, [currentPage]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      <Breadcrumbs
        items={[{ label: activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions' }]}
      />

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          aria-pressed={activeTab === 'privacy'}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 px-4 transition-colors ${
            activeTab === 'privacy'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          aria-pressed={activeTab === 'terms'}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 px-4 transition-colors ${
            activeTab === 'terms'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Terms & Conditions
        </button>
      </div>

      <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
        <strong>Sample content — not legal advice.</strong> {storeConfig.storeName} is a front-end
        demo template with no backend, accounts, or payment processing. The text below is placeholder
        copy that describes only how the demo actually behaves. Replace both documents with policies
        reviewed by your own counsel before launching a real store.
      </p>

      {activeTab === 'privacy' ? (
        <article className="max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-heading mb-2">
              Privacy & Data Policy (Sample)
            </h1>
            <p className="text-neutral-400 text-xs">Placeholder — replace before launch</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">1. About This Document</h2>
            <p>
              This is placeholder privacy content for the {storeConfig.storeName} demonstration
              template. It describes the demo&apos;s actual behavior rather than a real business. It is
              an example only and does not create any obligation or grant any legal right.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">2. What the Demo Stores</h2>
            <p>
              The demo has no server and no user accounts. To remember your cart and wishlist while
              you browse, it saves those selections in your own browser&apos;s local storage on your
              device. This information is not transmitted anywhere and disappears if you clear your
              browser data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">3. Analytics and Cookies</h2>
            <p>
              This template ships without analytics, advertising pixels, or tracking cookies. If you
              add such tools to your own store, update this section to describe them accurately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">4. Your Data Choices</h2>
            <p>
              Because nothing leaves your browser in the demo, there is no server-side account or
              profile to access, correct, or delete. On a real store you would replace this section
              with the rights and processes that apply to your business and jurisdiction.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">5. Before You Launch</h2>
            <p>
              Replace this entire document with a privacy policy that reflects your real data
              collection, storage, third-party services, and the privacy laws that apply to you.
            </p>
          </section>
        </article>
      ) : (
        <article className="max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-heading mb-2">
              Terms & Conditions (Sample)
            </h1>
            <p className="text-neutral-400 text-xs">Placeholder — replace before launch</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">1. About These Terms</h2>
            <p>
              This is placeholder terms-of-service copy for the {storeConfig.storeName} demonstration
              template. It is an example only, is not legal advice, and does not form a binding
              agreement of any kind.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">2. No Real Sales</h2>
            <p>
              The storefront is a front-end demo. There is no checkout backend, no payment
              processing, and no order fulfilment. Any &ldquo;order&rdquo; you place is simulated and
              produces only an on-screen confirmation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">3. Sample Prices and Content</h2>
            <p>
              Prices, products, descriptions, reviews, and brand details are fictional sample data
              included to demonstrate the interface. They do not represent a real catalog.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">4. Licensing</h2>
            <p>
              The template source code is provided under the MIT license included with the project.
              Sample brand names and copy are placeholders intended to be replaced.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">5. Before You Launch</h2>
            <p>
              Replace these terms with your own agreements covering pricing, orders, payment, returns,
              and liability before operating a real store.
            </p>
          </section>
        </article>
      )}
    </div>
  );
};
