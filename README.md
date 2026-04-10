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
4. Run the frontend:
   `npm run dev`

## Required Environment Variables

- `APP_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Payments

- Frontend checkout posts to `api/checkout-session.ts`
- Stripe redirects back to `/checkout/success`
- `api/stripe-webhook.ts` confirms payment and decrements inventory
