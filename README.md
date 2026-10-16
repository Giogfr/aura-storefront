# AURA — Modern Ecommerce Storefront Template

A polished, modern, and highly modular ecommerce storefront template built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. It ships with responsive product grids, faceted filtering, rich product pages, a slide-out cart, wishlist, quick view, search, and an end-to-end (simulated) checkout.

**Live demo:** [aura-storefront-gio.vercel.app](https://aura-storefront-gio.vercel.app/)

> **This is a front-end template, not a working store.** There is no backend, no database, and no payment or email provider. Checkout, accounts, orders, reviews, and newsletter signup are all simulated client-side for demonstration purposes. Please read [Demo data & simulated behavior](#demo-data--simulated-behavior) before using it as a starting point.

---

## Features

- **Responsive layout** — mobile-first design with a sticky header, announcement bar, mega menu, and a mobile navigation drawer.
- **Catalog & collections** — shop page with faceted filtering (category, price, availability, colors, sizes), sorting, and adjustable grid density.
- **Product detail** — image gallery with a fullscreen lightbox, variant selection, quantity stepper, sticky add-to-cart bar, spec accordions, size guide, related and recently-viewed products.
- **Search** — an overlay with instant results plus a dedicated search results page.
- **Cart & wishlist** — slide-out drawers with quantity management, promo codes, free-shipping progress, and `localStorage` persistence.
- **Simulated checkout** — a multi-step checkout flow with shipping methods, a promo field, order summary, and a demo confirmation screen.
- **Multi-currency** — runtime currency switcher (header and footer) with configurable conversion rates.
- **Content pages** — about, contact, FAQ, shipping & returns, legal, and a 404 page.
- **Accessibility-minded** — semantic buttons, labelled form controls, `aria-expanded`/`aria-pressed` states, keyboard-operable overlays, and reduced-motion support.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19 |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | lucide-react |

## Getting started

Requires **Node.js 20.19+**.

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (typically http://localhost:5173).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run typecheck` | Run `tsc --noEmit`. |
| `npm run lint` | Alias for `typecheck`. |
| `npm run clean` | Remove the `dist/` directory. |

## Project structure

```
src/
├─ components/
│  ├─ common/     # CartDrawer, WishlistDrawer, SearchOverlay, ProductCard/Grid, modals, Toast, Breadcrumbs
│  └─ layout/     # Header, Footer, MobileMenu
├─ context/       # StoreContext — global store (cart, wishlist, currency, nav, toasts, account)
├─ data/          # products.ts, storeConfig.ts — the template's content/data source
├─ pages/         # One component per route/page
├─ types.ts       # Shared TypeScript types
├─ index.css      # Tailwind entry + custom keyframes/utilities
├─ App.tsx        # Page switching + global overlays
└─ main.tsx       # React root
public/
└─ favicon.svg
```

Routing is handled with a lightweight internal navigation state (`navigateTo`) synchronized with the URL query string and the browser back/forward buttons, so there is no router dependency to configure.

## Customizing

Most of the storefront is driven by two files:

- **`src/data/storeConfig.ts`** — store name, tagline, announcement messages, shipping thresholds/fees, contact details, categories, FAQ content, and homepage promotional banners.
- **`src/data/products.ts`** — the product catalog (pricing, images, variants, specs, reviews, tags, flags).

Currency options and conversion rates live in `src/context/StoreContext.tsx` (`availableCurrencies`).

## Demo data & simulated behavior

This template intentionally includes interactive flows so you can explore the UX end-to-end. None of them are connected to real services:

- **Checkout** generates a local order reference and clears the cart. **No payment is processed.**
- **Accounts** sign in without authentication and store nothing.
- **Reviews** are added to local component state for the session only.
- **Contact form** and **newsletter** capture input but send nothing.
- **Orders, addresses, and policies** are illustrative sample content.
- A `WELCOME10` promo code (and a few others) are pre-wired as examples.

Replace these with real integrations before production use, and update the placeholder legal/policy text accordingly.

## License

[MIT](./LICENSE)
