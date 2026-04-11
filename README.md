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
3. Apply [supabase/migrations/001_initial_storefront.sql](/C:/sulvatech/thedmashop/supabase/migrations/001_initial_storefront.sql) to your Supabase project.
4. Seed required CMS content:
   `npm run seed:cms`
5. Create or promote your first admin user:
   `npm run promote:admin`
6. Run the frontend:
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
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Production Launch Sequence

1. Set all env vars, including `ADMIN_BOOTSTRAP_EMAIL`.
2. Run the Supabase migration.
3. Run `npm run seed:cms` to create required storefront CMS rows if they are missing.
4. Run `npm run promote:admin` to create or promote the first admin user.
6. Configure the Stripe webhook to target `api/stripe-webhook.ts`.
7. Verify the `product-media` bucket is public and can serve catalog images.

## Verification Checklist

- Confirm sign-up and sign-in succeed with Supabase Auth.
- Confirm `/admin` is blocked for non-admin users and opens for the promoted admin.
- Confirm `/shop` and `/products/:slug` load only Supabase-backed catalog data.
- Confirm checkout session creation succeeds and Stripe redirects back to `/checkout/success`.
- Confirm webhook payment finalization updates orders and inventory.
- Confirm new orders appear in both `/account/orders` and `/admin/orders`.

## Payments

- Frontend checkout posts to `api/checkout-session.ts`
- Stripe redirects back to `/checkout/success`
- `api/stripe-webhook.ts` confirms payment and decrements inventory
