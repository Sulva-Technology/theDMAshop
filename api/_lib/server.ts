import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const stripe = new Stripe(requiredEnv('STRIPE_SECRET_KEY'), {
  apiVersion: '2026-03-25.dahlia',
});

export const supabaseAdmin = createClient(
  requiredEnv('SUPABASE_URL'),
  requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  { auth: { persistSession: false } },
);

export function json(response: unknown, statusCode = 200) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  };
}

export function generateOrderNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DMA-${stamp}-${suffix}`;
}
