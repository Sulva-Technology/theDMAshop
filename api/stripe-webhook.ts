import Stripe from 'stripe';

import { getStripe, getSupabaseAdmin } from './_lib/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: any) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature || Array.isArray(signature)) {
    return res.status(400).json({ error: 'Missing stripe signature' });
  }

  try {
    const stripe = getStripe();
    const supabaseAdmin = getSupabaseAdmin();
    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET as string);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        return res.status(200).json({ received: true });
      }

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .select('id, stripe_checkout_session_id, order_items ( variant_id, quantity )')
        .eq('id', orderId)
        .maybeSingle();

      if (orderError || !order) {
        throw orderError ?? new Error('Unable to find matching order');
      }

      if (order.stripe_checkout_session_id !== session.id) {
        return res.status(200).json({ received: true });
      }

      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'paid',
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
        })
        .eq('id', orderId);

      for (const item of order.order_items ?? []) {
        const { data: variant } = await supabaseAdmin
          .from('product_variants')
          .select('inventory_quantity')
          .eq('id', item.variant_id)
          .maybeSingle();

        const nextInventory = Math.max(0, Number(variant?.inventory_quantity ?? 0) - Number(item.quantity ?? 0));
        await supabaseAdmin
          .from('product_variants')
          .update({ inventory_quantity: nextInventory })
          .eq('id', item.variant_id);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message ?? 'Webhook handling failed' });
  }
}
