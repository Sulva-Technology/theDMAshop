import { SEED_ORDERS } from '@/lib/seed-data';
import { hasSupabaseConfig, requireSupabase } from '@/lib/supabase';
import type { Order } from '@/lib/types';

function mapOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    guestEmail: row.guest_email,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    status: row.fulfillment_status,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    date: row.created_at,
    subtotal: Number(row.subtotal ?? 0),
    shippingAmount: Number(row.shipping_amount ?? 0),
    taxAmount: Number(row.tax_amount ?? 0),
    total: Number(row.total ?? 0),
    shippingAddress: row.shipping_address,
    billingAddress: row.billing_address,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    items: (row.order_items ?? []).map((item: any) => ({
      id: item.id,
      orderId: item.order_id,
      productId: item.product_id,
      variantId: item.variant_id,
      name: item.name,
      color: item.color,
      size: item.size,
      image: item.image,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
      lineTotal: Number(item.line_total),
    })),
  };
}

const ORDER_SELECT = `
  id,
  order_number,
  user_id,
  guest_email,
  customer_name,
  customer_email,
  payment_status,
  fulfillment_status,
  subtotal,
  shipping_amount,
  tax_amount,
  total,
  shipping_address,
  billing_address,
  stripe_checkout_session_id,
  stripe_payment_intent_id,
  created_at,
  order_items (
    id,
    order_id,
    product_id,
    variant_id,
    name,
    color,
    size,
    image,
    quantity,
    unit_price,
    line_total
  )
`;

export async function fetchOrdersForCurrentUser(userId?: string | null): Promise<Order[]> {
  if (!hasSupabaseConfig || !userId) {
    return SEED_ORDERS;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapOrder);
}

export async function fetchAdminOrders(): Promise<Order[]> {
  if (!hasSupabaseConfig) {
    return SEED_ORDERS;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.from('orders').select(ORDER_SELECT).order('created_at', { ascending: false });
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapOrder);
}

export async function updateOrderFulfillmentStatus(orderId: string, status: Order['fulfillmentStatus']) {
  if (!hasSupabaseConfig) {
    return;
  }

  const supabase = requireSupabase();
  const { error } = await supabase.from('orders').update({ fulfillment_status: status }).eq('id', orderId);
  if (error) {
    throw error;
  }
}
