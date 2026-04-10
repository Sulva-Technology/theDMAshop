import { generateOrderNumber, stripe, supabaseAdmin } from './_lib/server';

type CheckoutItem = {
  id: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};

type Address = {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email,
      shippingAddress,
      billingAddress,
      shippingMethod,
      items,
    } = req.body as {
      email: string;
      shippingAddress: Address;
      billingAddress: Address;
      shippingMethod: 'standard' | 'express';
      items: CheckoutItem[];
    };

    if (!email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing checkout data' });
    }

    const variantIds = items.map((item) => item.variantId);
    const { data: variants, error: inventoryError } = await supabaseAdmin
      .from('product_variants')
      .select('id, inventory_quantity')
      .in('id', variantIds);

    if (inventoryError) {
      throw inventoryError;
    }

    const inventoryMap = new Map((variants ?? []).map((variant) => [variant.id, Number(variant.inventory_quantity ?? 0)]));

    for (const item of items) {
      const available = inventoryMap.get(item.variantId);
      if (available === undefined || available < item.quantity) {
        return res.status(409).json({
          error: `Variant ${item.name} (${item.color}/${item.size}) is no longer in stock in the requested quantity.`,
        });
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingAmount = shippingMethod === 'express' ? 15 : 0;
    const taxAmount = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + shippingAmount + taxAmount;
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        guest_email: email,
        customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
        customer_email: email,
        payment_status: 'pending',
        fulfillment_status: 'processing',
        subtotal,
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        total,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      throw orderError ?? new Error('Unable to create pending order');
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      name: item.name,
      color: item.color,
      size: item.size,
      image: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.price * item.quantity,
    }));

    const { error: orderItemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
    if (orderItemsError) {
      throw orderItemsError;
    }

    const origin = req.headers.origin || process.env.APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        ...items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(item.price * 100),
            product_data: {
              name: `${item.name} - ${item.color}/${item.size}`,
              images: item.image ? [item.image] : [],
              metadata: {
                productId: item.productId,
                variantId: item.variantId,
              },
            },
          },
        })),
        ...(shippingAmount > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: 'usd',
                  unit_amount: shippingAmount * 100,
                  product_data: { name: 'Express Shipping' },
                },
              },
            ]
          : []),
      ],
      success_url: `${origin}/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        orderId: order.id,
        orderNumber,
      },
    });

    await supabaseAdmin
      .from('orders')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', order.id);

    return res.status(200).json({ url: session.url, orderNumber });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message ?? 'Unable to create checkout session' });
  }
}
