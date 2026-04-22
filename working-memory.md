## Problem Summary
- Replace the storefront's bland loading states with a branded preloader that feels intentional and matches the existing premium aesthetic.

## Product Goal
- Make the app feel polished during auth and catalog initialization instead of showing a blank or plain text loading block.

## Stack and Runtime
- framework: Vite + React 19
- language: TypeScript
- ui styling: Tailwind CSS v4, shadcn/base-ui primitives, motion/react
- backend/runtime: Supabase-backed storefront state, client-rendered routing with React Router
- database: Supabase
- deployment assumptions: web storefront deployed as a Vite SPA

## Confirmed Facts
- `src/App.tsx` returns a blank `min-h-screen` div while `authLoading` is true for protected routes.
- `src/components/Home.tsx`, `src/components/Shop.tsx`, and `src/components/ProductDetails.tsx` use plain bordered text blocks for primary storefront loading states.
- The visual language already uses a dark editorial hero with soft blue atmospheric glows and premium rounded cards.

## Unknowns / Needs Confirmation
- unknown whether the user wants the same preloader reused in admin/account surfaces too

## Active Files / Surfaces
- `src/App.tsx`
- `src/components/Home.tsx`
- `src/components/Shop.tsx`
- `src/components/ProductDetails.tsx`
- `src/components/ui/StorefrontPreloader.tsx`

## Decisions
- Add one shared preloader component instead of duplicating ad hoc loaders.
- Match the loader to the storefront hero styling so it feels native to the brand.
- Apply the preloader to customer-facing loading states first, including protected-route auth waiting.

## API Contracts
- none changed

## Data Model
- none changed

## Auth and Security
- Protected routes still block until `authLoading` resolves; only the visual fallback changes.

## UI System Notes
- Preloader should preserve accessibility with `role="status"` and live-region semantics.
- Fullscreen and contained variants keep the experience consistent across route guards and page content.

## Bugs Fixed
- Replaced the blank auth-loading fallback with a branded fullscreen preloader for account and admin gates.
- Replaced plain text storefront loading blocks on home, shop, and product details pages with the shared branded preloader.

## Risks / Watchouts
- Motion-heavy loading UI should stay visually lightweight and not fight the brand once real content appears.

## Next Actions
- Consider extending the same loader language to account/admin table states if the product team wants full consistency.
- Visually QA the preloader in-browser on mobile and desktop if additional polish is needed.
