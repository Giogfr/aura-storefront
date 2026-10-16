import React from 'react';
import { useStore } from '../context/StoreContext';
import { storeConfig } from '../data/storeConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Truck, RotateCcw, PackageCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const ShippingReturnsPage: React.FC = () => {
  const { navigateTo, formatPrice } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
      <Breadcrumbs items={[{ label: 'Shipping & Returns' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Delivery & Exchange Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif-heading">
          Shipping & Returns
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Clear, straightforward policies for domestic and worldwide delivery, easy 30-day returns, and hassle-free size exchanges.
        </p>
      </div>

      {/* Delivery Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-2">
          <Truck className="w-5 h-5 text-neutral-900 mb-1" />
          <h3 className="text-sm font-bold text-neutral-900">Complimentary Shipping</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Standard delivery is completely free on all domestic orders totaling {formatPrice(storeConfig.freeShippingThreshold)} or greater.
          </p>
        </div>

        <div className="p-5 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-2">
          <RotateCcw className="w-5 h-5 text-neutral-900 mb-1" />
          <h3 className="text-sm font-bold text-neutral-900">30-Day Return Guarantee</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Take up to 30 days from confirmed receipt to try your items at home. We provide prepaid digital return labels.
          </p>
        </div>

        <div className="p-5 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-2">
          <PackageCheck className="w-5 h-5 text-neutral-900 mb-1" />
          <h3 className="text-sm font-bold text-neutral-900">Eco-Conscious Packaging</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            All parcels are packaged in plastic-free, recyclable card stock and biodegradable unbleached mailers.
          </p>
        </div>
      </div>

      {/* Shipping Methods Table */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-neutral-900 font-serif-heading">
          Shipping Options & Delivery Timelines
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-neutral-200">
            <thead>
              <tr className="bg-neutral-100 text-neutral-900 font-bold">
                <th className="p-3 border border-neutral-200">Delivery Tier</th>
                <th className="p-3 border border-neutral-200">Estimated Transit</th>
                <th className="p-3 border border-neutral-200">Order Minimum</th>
                <th className="p-3 border border-neutral-200">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700">
              <tr>
                <td className="p-3 font-semibold border border-neutral-200">Domestic Standard Ground</td>
                <td className="p-3 border border-neutral-200">3–5 Business Days</td>
                <td className="p-3 border border-neutral-200">{formatPrice(storeConfig.freeShippingThreshold)}+</td>
                <td className="p-3 font-bold text-emerald-700 border border-neutral-200">FREE</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold border border-neutral-200">Domestic Standard Ground</td>
                <td className="p-3 border border-neutral-200">3–5 Business Days</td>
                <td className="p-3 border border-neutral-200">Under {formatPrice(storeConfig.freeShippingThreshold)}</td>
                <td className="p-3 border border-neutral-200">{formatPrice(10)} Flat Rate</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold border border-neutral-200">Priority Express 2-Day Air</td>
                <td className="p-3 border border-neutral-200">1–2 Business Days</td>
                <td className="p-3 border border-neutral-200">Any</td>
                <td className="p-3 border border-neutral-200">{formatPrice(15)}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold border border-neutral-200">Worldwide International Tracked</td>
                <td className="p-3 border border-neutral-200">6–10 Business Days</td>
                <td className="p-3 border border-neutral-200">Any</td>
                <td className="p-3 border border-neutral-200">{formatPrice(25)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Procedure */}
      <div className="space-y-6 pt-4 border-t border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 font-serif-heading">
          How to Initiate a Return or Exchange
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 rounded-lg">
            <span className="text-xs font-bold text-neutral-400 block mb-1">Step 1</span>
            <h4 className="text-sm font-semibold text-neutral-900 mb-1">Request Digital Label</h4>
            <p className="text-xs text-neutral-500">
              Email our support team with your Order Reference Number (e.g. AU-89214).
            </p>
          </div>

          <div className="p-4 border border-neutral-200 rounded-lg">
            <span className="text-xs font-bold text-neutral-400 block mb-1">Step 2</span>
            <h4 className="text-sm font-semibold text-neutral-900 mb-1">Pack In Original Box</h4>
            <p className="text-xs text-neutral-500">
              Repack garments unworn, unwashed, with designer tags attached.
            </p>
          </div>

          <div className="p-4 border border-neutral-200 rounded-lg">
            <span className="text-xs font-bold text-neutral-400 block mb-1">Step 3</span>
            <h4 className="text-sm font-semibold text-neutral-900 mb-1">Drop Off & Refund</h4>
            <p className="text-xs text-neutral-500">
              Drop at any authorized postal partner. Refunds post to your original payment within 48 hours.
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-semibold">Important Final Sale Conditions</p>
            <p className="text-amber-800">
              Archival clearance items discounted by 40% or more, customized engravings, and intimate skincare formulas are final sale unless arriving damaged.
            </p>
          </div>
        </div>
      </div>

      {/* Need Assistance CTA */}
      <div className="p-8 bg-neutral-900 text-white rounded-xl text-center space-y-4">
        <h3 className="text-xl font-bold font-serif-heading">Have an exchange question?</h3>
        <p className="text-xs text-neutral-300 max-w-md mx-auto">
          Our customer service team is on hand Monday through Friday, 9:00am - 6:00pm EST to assist with fitting, tracking, and courier arrangements.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('contact')}
          className="px-6 py-2.5 bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-2 min-h-[44px]"
        >
          <span>Contact Concierge</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
