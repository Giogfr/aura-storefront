import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { storeConfig } from '../data/storeConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast, navigateTo } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: 'Order Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to our concierge team.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Customer Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif-heading">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Whether you need product advice, order status, or wholesale consultation, our studio team is here to assist you promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
        {/* Contact Form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-neutral-50 p-6 sm:p-10 rounded-lg border border-neutral-200/80">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 font-serif-heading">
                Message Received
              </h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Thank you, {formData.name}. A customer specialist will review your inquiry and respond to <strong>{formData.email}</strong> within 12 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-neutral-900 font-semibold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Order Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="AU-12345"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                  >
                    <option value="Order Inquiry">Order Inquiry & Tracking</option>
                    <option value="Returns">Returns & Exchanges</option>
                    <option value="Product Advice">Product Advice & Sizing</option>
                    <option value="Press">Press & Editorial</option>
                    <option value="Wholesale">Wholesale & Stockists</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How may we assist you today?"
                  className="w-full p-3 text-xs bg-white border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Details (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 font-serif-heading">
              Studio Headquarters
            </h2>

            <div className="space-y-4 text-xs text-neutral-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900">Showroom & Studio:</strong>
                  <span>{storeConfig.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900">Email:</strong>
                  <span>{storeConfig.contactEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900">Telephone:</strong>
                  <span>{storeConfig.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900">Concierge Hours:</strong>
                  <span>Monday – Friday: 9:00 AM – 6:00 PM EST</span>
                  <span className="block text-neutral-400">Saturday: 10:00 AM – 4:00 PM EST</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-neutral-100 rounded-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Frequently Asked Support
            </h3>
            <p className="text-xs text-neutral-600">
              Looking for quick answers regarding return labels or delivery timelines?
            </p>
            <div className="space-y-1 pt-1">
              <button
                onClick={() => navigateTo('faq')}
                className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
              >
                <span>Read Customer FAQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigateTo('shipping-returns')}
                className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
              >
                <span>Review Shipping & Return Policies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
