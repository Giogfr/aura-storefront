# AURA — Modern Ecommerce Storefront Template

A polished, modern, and highly modular ecommerce storefront template built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. It ships with responsive product grids, faceted filtering, rich product pages, a slide-out cart, wishlist, quick view, search, and an end-to-end (simulated) checkout.

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![CI](https://github.com/Giogfr/aura-storefront/actions/workflows/ci.yml/badge.svg)](https://github.com/Giogfr/aura-storefront/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**Live demo:** [aura-storefront-gio.vercel.app](https://aura-storefront-gio.vercel.app/)

> **This is a front-end template, not a working store.** There is no backend, no database, and no payment or email provider. Checkout, accounts, orders, reviews, and newsletter signup are all simulated client-side for demonstration purposes. Please read [Demo data & simulated behavior](#demo-data--simulated-behavior) before using it as a starting point.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [How routing works](#how-routing-works)
- [State management](#state-management)
- [Customization](#customization)
- [Accessibility](#accessibility)
- [Demo data & simulated behavior](#demo-data--simulated-behavior)
- [Promo codes](#promo-codes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Assets & licensing](#assets--licensing)
- [Contributing](#contributing)
- [License](#license)

## Features

**Layout & navigation**
- Mobile-first, responsive layout with a sticky header, rotating announcement bar, mega menu, and a slide-out mobile navigation drawer.
- Deep-linkable navigation: every view is reflected in the URL query string and the browser back/forward buttons.
- Multi-currency switcher in both the header and footer (USD, EUR, GBP, CAD, AUD) with configurable conversion rates. Rates are static **sample** values, not live exchange rates, and are labeled as such in the UI.

**Catalog**
- Shop page with faceted filtering (category, price range, availability, colors, sizes), sorting, adjustable grid density (2/3/4 columns), and "load more" pagination.
- Curated deep-links (e.g. `?page=shop&filter=sale`) that apply an archive-sale, new-arrivals, or bestseller view.
- Collections directory and per-category landing views.

**Product detail**
- Image gallery with hover cross-fade, fullscreen lightbox, and keyboard navigation.
- Variant selection (color/size), quantity stepper, sticky add-to-cart bar, specification accordions, an interactive size guide, related products, and recently-viewed rail.
- Session-only product reviews with a submission form.

**Cart, wishlist & checkout**
- Slide-out cart and wishlist drawers with quantity management, cross-sell suggestions, and free-shipping progress.
- Promo codes, order notes, and `localStorage` persistence for the cart and wishlist.
- A multi-step checkout (information → shipping → payment) that gates each step, validates required fields before advancing, and supports back/next navigation, shipping methods, a promo field, order summary, and an empty-bag guard.
- A demo confirmation screen with a generated order reference.

**Search & content**
- Instant search overlay with tokenized matching and a dedicated search results page.
- About, Contact, FAQ, Shipping & Returns, Legal (privacy/terms), and a 404 page.

**Foundations**
- Strict TypeScript, semantic/accessible components, and `prefers-reduced-motion` support.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | [React 19](https://react.dev) |
| Language | [TypeScript](https://www.typescriptlang.org) (`strict`) |
| Build tool | [Vite](https://vite.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Icons | [lucide-react](https://lucide.dev) |
| State | React Context + hooks (no state library) |
| Routing | Lightweight internal navigation state synced with the URL (no router dependency) |

## Requirements

- **Node.js 20.19+** (see [`.nvmrc`](./.nvmrc))
- npm (or pnpm/yarn — adjust commands accordingly)

## Getting started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# type-check
npm run typecheck

# run the unit tests
npm test

# production build into dist/
npm run build

# preview the production build locally
npm run preview
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run typecheck` | Run `tsc --noEmit` in strict mode. |
| `npm test` | Run the unit test suite once with [Vitest](https://vitest.dev). |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run clean` | Remove the `dist/` directory. |

CI runs `typecheck`, `test`, and `build` on every push to `main` and on pull requests (see [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

## Project structure

```
src/
├─ components/
│  ├─ common/     # CartDrawer, WishlistDrawer, SearchOverlay, QuickViewModal,
│  │              # ProductCard/Grid, AccountModal, Toast, Breadcrumbs
│  └─ layout/     # Header, Footer, MobileMenu
├─ context/       # StoreContext — global store (cart, wishlist, currency, nav, toasts, account)
├─ data/          # products.ts, storeConfig.ts — the template's content/data source
├─ lib/           # Pure, unit-tested helpers: cart validation, promos, routing, currency
├─ pages/         # One component per route/page
├─ types.ts       # Shared TypeScript types
├─ index.css      # Tailwind entry + custom keyframes/utilities
├─ App.tsx        # Page switching + global overlays
└─ main.tsx       # React root
public/
├─ favicon.svg
├─ site.webmanifest
└─ robots.txt
.github/
└─ workflows/ci.yml
```

## How routing works

There is **no router dependency**. `StoreContext` holds `currentPage` and `routeParams` and exposes a `navigateTo(page, params?)` helper. Each navigation:

1. updates React state, and
2. writes a query string to the URL (e.g. `?page=shop&cat=footwear`).

On mount and on `popstate` (back/forward), the query string is parsed back into state, so views are shareable and bookmarkable. Supported params: `page`, `id` (product), `cat` (category), `q` (search), and `filter` (curated view).

## State management

All cross-cutting state lives in a single `StoreProvider` (`src/context/StoreContext.tsx`):

- **Navigation** — `currentPage`, `routeParams`, `navigateTo`.
- **Currency** — `activeCurrency`, `availableCurrencies`, `formatPrice`.
- **Cart** — items, derived totals (subtotal, discount, shipping, tax, grand total), add/remove/update, promo codes.
- **Wishlist** — saved product IDs.
- **UI** — quick view, search overlay, account modal, and toast state.
- **History** — recently viewed products and recent searches.

Cart and wishlist are persisted to `localStorage`; everything else is in-memory for the session.

## Customization

Most of the storefront is driven by two files:

### Store configuration — `src/data/storeConfig.ts`

Store name and tagline, announcement-bar messages, free-shipping threshold, standard/express shipping fees, contact details, social links, category definitions, FAQ content, homepage promotional banners, and the Instagram grid.

### Product catalog — `src/data/products.ts`

The full product dataset: pricing (`price`, `compareAtPrice`, `isSale`), merchandising flags (`isNew`, `isFeatured`, `isBestSeller`), inventory, images, colors, sizes, descriptions, specifications, materials, care instructions, shipping info, and reviews.

### Currency

Currency options and conversion rates live in `src/context/StoreContext.tsx` (`availableCurrencies`). `formatPrice()` applies the active rate and symbol. The bundled rates are **static sample values for the demo**, not live exchange rates — swap them for a rates API or provider when you go to production.

### Theming & styling

- Tailwind CSS v4 is wired through `@tailwindcss/vite` and imported in `src/index.css` — there is no `tailwind.config.js` to maintain.
- Global tokens (fonts, focus rings, custom scrollbar), keyframe animations, and utilities such as `.no-scrollbar` are defined in `src/index.css`.
- Initial theme color and base background/text colors are set in `index.html`.

### Fonts & icons

- The UI uses **Plus Jakarta Sans**, loaded from Google Fonts in `index.html`. Swap the `<link>` and the `font-family` stack in `src/index.css` to change it.
- Icons come from `lucide-react`; import only what you use.

## Accessibility

- Semantic `<button>` elements for all interactive controls, with `aria-label`s and visible focus rings.
- Dialog semantics (`role="dialog"`, `aria-modal`) on drawers/modals, with `Escape` to close and background scroll locking.
- `aria-expanded`, `aria-pressed`, `aria-selected`, and `aria-live` states for toggles, menus, and toasts.
- Associated `<label>`/`id` pairs on form fields.
- A `prefers-reduced-motion` block disables animations/transitions for users who request it.

## Demo data & simulated behavior

The template intentionally includes interactive flows so you can explore the UX end to end. None of them connect to real services:

| Area | What actually happens |
| --- | --- |
| **Checkout** | Generates a local order reference and clears the cart. **No payment is processed.** |
| **Express checkout** | Shop Pay / Apple Pay / PayPal show a "simulated" toast. |
| **Accounts** | Sign in without authentication; nothing is stored remotely. |
| **Orders & addresses** | Illustrative sample content in the account modal. |
| **Reviews** | Added to local component state for the session only. |
| **Contact form & newsletter** | Capture input but send nothing. |
| **Policies** | Placeholder legal text for demonstration. |

Replace these with real integrations before production use, and update the placeholder legal/policy text accordingly.

### Checkout totals (demo rules)

Totals are computed consistently and intentionally:

- **Subtotal** — sum of line prices × quantities.
- **Discount** — the promo-code rate applied to the subtotal.
- **Shipping** — free when `FREESHIP` is applied or the subtotal reaches the free-shipping threshold; otherwise the standard fee. Choosing express shipping always uses the express fee.
- **Estimated tax** — a fixed 8% (`TAX_RATE` in `src/lib/storeUtils.ts`) applied to the discounted **merchandise** subtotal only; shipping is not taxed.
- **Total** — discounted subtotal + shipping + tax.

Cart and wishlist data in `localStorage` is validated on load: malformed entries, unknown products, and sold-out products are dropped, and quantities are clamped to available stock. Products with zero inventory can never be added to the cart.

## Promo codes

A few promo codes are pre-wired as examples (case-insensitive):

| Code | Effect |
| --- | --- |
| `WELCOME10` | 10% off the order |
| `SAVE20` | 20% off the order |
| `FREESHIP` | Waives standard shipping |

## Testing

Unit tests cover the pure store helpers in `src/lib/` — cart validation and stock clamping, promo-code resolution, currency formatting, and route parsing — and run with [Vitest](https://vitest.dev):

```bash
npm test          # single run
npm run test:watch
```

Tests live next to the code they cover (e.g. `src/lib/storeUtils.test.ts`). Add tests alongside new pure logic, and extend the suite as you grow the storefront.

## Deployment

The project builds to a static `dist/` folder and can be hosted anywhere that serves static files.

- **Build command:** `npm run build`
- **Output directory:** `dist`

For Vercel, Netlify, GitHub Pages, or any static host, set the build command and output directory above. Because routing is query-string based (not path based), no SPA rewrite rules are required.

## Troubleshooting

- **Blank page after deploy** — confirm the host serves `index.html` at the site root and that assets resolve (the Vite `base` is `/` by default).
- **Fonts look different locally** — the font is fetched from Google Fonts; ensure network access or self-host it.
- **Cart/wishlist appears stale** — state is cached in `localStorage`. Clear site data for the origin to reset.

## Assets & licensing

- **Source code** is released under the [MIT license](./LICENSE).
- **Images** are loaded from [Unsplash](https://unsplash.com) and are included for demonstration only. The MIT license covers this template's code — **not** the third-party images or any content inside the sample data. Unsplash photos are governed by the [Unsplash License](https://unsplash.com/license); replace them with your own assets (or verify their terms) before commercial use.
- **Brand name, copy, prices, product data, reviews, and policies** are fictional sample content intended to be replaced. Nothing in the demo represents a real business, certification, partnership, or service.

## Contributing

Contributions are welcome. Please keep the template framework-free beyond its existing dependencies, run `npm run typecheck` and `npm test` before opening a pull request, and match the existing code style (no extra comments unless necessary, semantic HTML, accessible controls).

## License

[MIT](./LICENSE) © 2026 Giogfr
