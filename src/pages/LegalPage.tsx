import React, { useState } from 'react';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      <Breadcrumbs
        items={[{ label: activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions' }]}
      />

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 px-4 transition-colors ${
            activeTab === 'privacy'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 px-4 transition-colors ${
            activeTab === 'terms'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Terms & Conditions
        </button>
      </div>

      {activeTab === 'privacy' ? (
        <article className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif-heading mb-2">
              Privacy & Data Policy
            </h1>
            <p className="text-neutral-400 text-xs">
              Last revised: January 1, {new Date().getFullYear()}
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">1. Information We Collect</h2>
            <p>
              When you visit {storeConfig.storeName}, make a purchase, or create an account, we collect device identifiers, browsing behavior, shipping addresses, payment details, and email addresses solely to fulfill your orders and improve the store experience.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">2. How Your Data is Used</h2>
            <p>
              We process personal information exclusively to authenticate transactions, dispatch orders with carrier partners, communicate shipment tracking, and provide customer support. We never sell, monetize, or broker customer data to third-party advertising exchanges.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">3. Security & Payment Encryption</h2>
            <p>
              All transactions are encrypted utilizing industry-standard 256-Bit Secure Sockets Layer (SSL) technology. Credit card numbers are tokenized by PCI-DSS Level 1 compliant gateway processors and are never stored directly on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">4. Your Data Rights</h2>
            <p>
              Under applicable consumer privacy regulations (including GDPR and CCPA), you possess the right to inspect, update, or permanently delete personal data stored in connection with your account. Contact privacy@{storeConfig.storeName.toLowerCase()}.com to execute a data removal request.
            </p>
          </section>
        </article>
      ) : (
        <article className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif-heading mb-2">
              Terms & Conditions of Service
            </h1>
            <p className="text-neutral-400 text-xs">
              Last revised: January 1, {new Date().getFullYear()}
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">1. Agreement to Terms</h2>
            <p>
              By accessing and purchasing goods through {storeConfig.storeName}, you acknowledge and agree to be bound by these Terms of Service, all applicable laws and regulations, and accept responsibility for compliance with domestic trade guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">2. Accuracy of Product Information</h2>
            <p>
              We take rigorous care to ensure color swatches, photographic renderings, textile weights, and dimensions are accurately reflected. However, slight variations in natural materials such as vegetable-tanned leather, hand-blown glass, and artisanal ceramic glazes are inherent to genuine craft.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">3. Pricing & Order Acceptance</h2>
            <p>
              All prices are listed in United States Dollars (USD) unless converted via the regional currency selector. We reserve the right to cancel orders in the event of unforeseen inventory discrepancies or typographical pricing errors.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">4. Intellectual Property</h2>
            <p>
              All typography, branding assets, custom photography, editorial text, and garment design silhouettes featured across this storefront are protected by international copyright and intellectual property treaties.
            </p>
          </section>
        </article>
      )}
    </div>
  );
};
