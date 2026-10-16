import { StoreConfig, Category } from '../types';

export const storeConfig: StoreConfig = {
  storeName: 'AURA',
  storeTagline: 'Modern Goods for Thoughtful Living',
  announcementBar: {
    enabled: true,
    messages: [
      'Demo storefront — checkout, accounts, and reviews are simulated.',
      'Complimentary global shipping on orders over $75',
      'End of Season Archive Sale — Up to 40% off selected essentials',
      'Designed with intention. Crafted with responsible materials.',
    ],
  },
  freeShippingThreshold: 75,
  standardShippingFee: 8,
  expressShippingFee: 18,
  contactEmail: 'care@aurastorefront.com',
  contactPhone: '+1 (800) 492-8721',
  address: '424 Broadway, 4th Floor, SoHo, New York, NY 10013',
  socials: {
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    pinterest: 'https://pinterest.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
  },
};

export const categoriesData: Category[] = [
  {
    id: 'apparel',
    name: 'Apparel',
    slug: 'apparel',
    description: 'Minimalist tailoring, organic cotton basics, and relaxed everyday garments.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop',
    productCount: 6,
    featured: true,
  },
  {
    id: 'footwear',
    name: 'Footwear',
    slug: 'footwear',
    description: 'Handcrafted leather sneakers, boots, and slip-on loafers built for comfort.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    productCount: 4,
    featured: true,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Refined leather goods, minimalist timepieces, eyewear, and structured bags.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    productCount: 4,
    featured: true,
  },
  {
    id: 'home',
    name: 'Home & Living',
    slug: 'home',
    description: 'Ceramic tableware, architectural lighting, soft linen throws, and fragrances.',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop',
    productCount: 4,
    featured: true,
  },
  {
    id: 'tech',
    name: 'Tech Essentials',
    slug: 'tech',
    description: 'Machined aluminum chargers, acoustic headphones, and precision desk tools.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    productCount: 4,
    featured: true,
  },
  {
    id: 'wellness',
    name: 'Wellness & Grooming',
    slug: 'wellness',
    description: 'Botanical extracts, cold-pressed elixirs, and restorative self-care rituals.',
    image: 'https://images.unsplash.com/photo-1608248597359-07b9a52c3c6f?q=80&w=1000&auto=format&fit=crop',
    productCount: 2,
    featured: false,
  },
];

export const storeBenefits = [
  {
    title: 'Complimentary Shipping',
    description: 'Free standard delivery on all domestic orders exceeding $75.',
    icon: 'Truck',
  },
  {
    title: '30-Day Effortless Returns',
    description: 'Try it at home. Hassle-free exchanges and prepaid return labels.',
    icon: 'RefreshCw',
  },
  {
    title: 'Streamlined Checkout',
    description: 'A complete, interactive checkout flow you can explore end to end.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Dedicated Customer Care',
    description: 'Live expert concierge ready to assist 7 days a week from 9am-8pm EST.',
    icon: 'Headphones',
  },
];

export const promoBanners = {
  hero: {
    badge: 'New Season 2026',
    title: 'Form Follows Simplicity',
    subtitle: 'A curated capsule of timeless everyday garments, tactile ceramics, and purposeful accessories engineered for daily life.',
    ctaText: 'Explore Collection',
    secondaryCta: 'View Lookbook',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
  },
  editorial: {
    badge: 'Material Story',
    title: 'Organic Texture. Uncompromising Precision.',
    description: 'Every piece in our permanent collection is sourced directly from heritage mills in Portugal and master artisans in Okayama. Designed without superfluous ornamentation.',
    ctaText: 'Discover Our Craft',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
  },
  largeCollectionBanner: {
    badge: 'Curated Edit',
    title: 'The Modern Sanctuary',
    subtitle: 'Transform your living space with minimal forms, ambient lighting, and hand-thrown stoneware.',
    ctaText: 'Shop Home & Living',
    categoryTarget: 'home',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
  },
};

export const instagramPosts = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    caption: 'Studio fitting with the Raw Cotton Chore Jacket.',
    handle: '@aura.studio',
    productId: 'prod-1',
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    caption: 'Structured silhouettes for morning transit.',
    handle: '@aura.studio',
    productId: 'prod-4',
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop',
    caption: 'Rest and recharge. The Ceramic Pouring Set on warm travertine.',
    handle: '@aura.studio',
    productId: 'prod-13',
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
    caption: 'Daily ritual essentials formulated with botanical rosemary.',
    handle: '@aura.studio',
    productId: 'prod-21',
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
    caption: 'Full-grain calfskin derbies breaking in effortlessly.',
    handle: '@aura.studio',
    productId: 'prod-7',
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    caption: 'Architectural shadows and the Canvas Weekender Tote.',
    handle: '@aura.studio',
    productId: 'prod-11',
  },
];

export const faqCategories = [
  {
    category: 'Orders & Payments',
    items: [
      {
        q: 'Which payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and interest-free installment plans through Klarna and Afterpay.',
      },
      {
        q: 'Can I cancel or amend my order after placing it?',
        a: 'Orders are processed quickly within 1-2 hours at our fulfillment hub. If you need to make changes or cancel, please contact care@aurastorefront.com immediately. Once fulfilled, orders must follow our standard return process.',
      },
      {
        q: 'How do I apply a discount code?',
        a: 'Enter your promotional code during checkout in the "Gift card or discount code" box and click Apply. The deduction will automatically reflect in your order subtotal before final payment.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How long will delivery take?',
        a: 'Standard domestic shipping typically arrives within 3-5 business days. Express 2-day delivery is available at checkout. International orders generally arrive within 7-12 business days depending on customs processing.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes, we offer complimentary standard shipping on all domestic orders totaling $75 or more prior to taxes and after promotional discounts.',
      },
      {
        q: 'How can I track my shipment?',
        a: 'As soon as your parcel is scanned by our carrier, you will receive an automated shipping confirmation email containing your tracking link and real-time transit updates.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy window?',
        a: 'We gladly accept unworn, unwashed items in their original packaging with tags intact within 30 days of confirmed delivery for a full refund to your original payment method.',
      },
      {
        q: 'How do I initiate a return or size exchange?',
        a: 'Visit our Returns portal, input your 6-digit order number and email address, and select the item you wish to return. You will instantly receive a prepaid digital return shipping label.',
      },
      {
        q: 'Are return shipping labels free?',
        a: 'Domestic exchanges and store credit returns are completely free. If opting for a full refund back to your original payment method, a flat $6 restocking fee is deducted from your refund total.',
      },
    ],
  },
  {
    category: 'Sizing & Materials',
    items: [
      {
        q: 'How do I determine the right size?',
        a: 'Each product page includes an interactive Size Guide with detailed garment measurements (chest, waist, sleeve, inseam). Most garments fit true to size with a relaxed, modern silhouette.',
      },
      {
        q: 'Where are your products manufactured?',
        a: 'We partner with certified ethical workshops in Portugal, Japan, and Italy that prioritize fair wages, renewable solar energy, and non-toxic dye certified by OEKO-TEX Standard 100.',
      },
    ],
  },
];

export const faqData = faqCategories.flatMap((cat) =>
  cat.items.map((item) => ({
    question: item.q,
    answer: item.a,
    category: cat.category,
  }))
);
