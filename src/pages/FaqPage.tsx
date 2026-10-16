import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { faqData } from '../data/storeConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ChevronDown, ChevronUp, Search, ArrowRight } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { navigateTo } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setOpenIndex(null);
  }, [activeCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'Shipping & Delivery', label: 'Shipping & Delivery' },
    { id: 'Returns & Exchanges', label: 'Returns & Exchanges' },
    { id: 'Orders & Payments', label: 'Orders & Payments' },
    { id: 'Sizing & Materials', label: 'Sizing & Materials' },
  ];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-10">
      <Breadcrumbs items={[{ label: 'Help & FAQ' }]} />

      <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
        Sample content — these questions, policies, and support details are illustrative examples for
        the demo template, not a real store&apos;s terms.
      </p>

      <div className="text-center max-w-xl mx-auto space-y-3 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Customer Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Everything you need to know about placing an order, international transit, return windows, and textile maintenance.
        </p>

        {/* Search within FAQ */}
        <div className="relative max-w-md mx-auto pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. tracking, returns)..."
            aria-label="Search frequently asked questions"
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs focus:outline-hidden focus:border-neutral-900"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-5" aria-hidden="true" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            aria-pressed={activeCategory === cat.id}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-neutral-900 text-white font-semibold'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion FAQ list */}
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No questions matched your search term. Feel free to contact our support team.
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div key={faq.question} className="py-4">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                className="w-full flex items-center justify-between text-left text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0 ml-4" />
                )}
              </button>
              {openIndex === index && (
                <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pr-6 animate-fade-in">
                  {faq.answer}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Still have questions banner */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Still have questions?</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Our customer concierge is available Monday to Friday to assist with personal styling or order queries.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('contact')}
          className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded hover:bg-neutral-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Contact Us</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
