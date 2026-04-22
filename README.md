# theDMAshop

Dynamic single-store commerce app built with React, Vite, Supabase, and Stripe.

## Stack

- Storefront: React 19 + Vite + Tailwind
- Backend: Supabase Auth, Postgres, Storage
- Payments: Stripe Checkout + Stripe webhook confirmation
- Admin: product, order, customer, and CMS management

## Local Setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set the required keys.
3. Apply the Supabase migrations in order:
   `001_initial_storefront.sql`, `002_fix_profiles_admin_policy.sql`, `003_add_newsletter_subscribers.sql`, and `004_add_product_media_storage.sql`
4. Install the admin browser test runtime:
   `npm run test:admin:install`
5. Seed required CMS content:
   `npm run seed:cms`
6. Create or promote your first admin user:
   `npm run promote:admin`
7. Run the frontend:
   `npm run dev`

## Required Environment Variables

- `APP_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `ADMIN_BOOTSTRAP_NAME`
- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Production Launch Sequence

1. Set all env vars, including `ADMIN_BOOTSTRAP_EMAIL`.
2. Run all Supabase migrations through `004_add_product_media_storage.sql`.
3. Run `npm run seed:cms` to create required storefront CMS rows if they are missing.
4. Run `npm run promote:admin` to create or promote the first admin user.
5. Run `npm run test:admin:install` on the test runner or deployment box that will execute browser tests.
6. Deploy on Vercel with the repo-root `vercel.json` so SPA routes like `/admin` and `/products/:slug` rewrite to `index.html`.
7. Configure the Stripe webhook to target `api/stripe-webhook.ts`.
8. The `product-media` bucket is now provisioned by migration; keep it public and verify it can serve catalog images.
9. Sign in at `/auth`, then open `/admin` with the promoted admin account.

## Verification Checklist

- Confirm sign-up and sign-in succeed with Supabase Auth.
- Confirm `/admin` is blocked for non-admin users and opens for the promoted admin.
- Run `npm run test:admin` to verify admin routing, product uploads, CMS saves, customer visibility, and order-module access.
- Confirm direct browser hits to `/admin`, `/admin/products`, `/auth`, and `/products/:slug` load the React app instead of a host-level 404.
- Confirm `/shop` and `/products/:slug` load only Supabase-backed catalog data.
- Confirm checkout session creation succeeds and Stripe redirects back to `/checkout/success`.
- Confirm webhook payment finalization updates orders and inventory.
- Confirm new orders appear in both `/account/orders` and `/admin/orders`.

## Admin Media Storage

- `004_add_product_media_storage.sql` creates the public `product-media` bucket used by `AdminProducts` and `AdminCMS`.
- Storage access is enforced with `storage.objects` policies: public read, admin-only write/delete.
- If uploads fail with a permission error, confirm the latest storage migration has been applied and that the signed-in user has the `admin` profile role.

## Admin E2E Tests

- Install browsers once with `npm run test:admin:install`.
- Run the suite with `npm run test:admin` or `npm run test:admin:headed`.
- The suite uses `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD`, falling back to `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD`.
- For full order-state coverage, run the suite against a Supabase project that already contains at least one actionable order.

## Payments

- Frontend checkout posts to `api/checkout-session.ts`
- Stripe redirects back to `/checkout/success`
- `api/stripe-webhook.ts` confirms payment and decrements inventory
