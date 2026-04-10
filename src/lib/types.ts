export type AppRole = 'customer' | 'admin';

export type ProductStatus = 'draft' | 'active' | 'archived';
export type VariantStatus = 'active' | 'inactive';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  phone?: string;
  defaultAddress?: Address | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroContent {
  title: string;
  slogan: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

export interface AboutContent {
  title: string;
  content: string;
  image: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface PolicyItem {
  title: string;
  content: string;
}

export interface CMSContent {
  hero: HeroContent;
  aboutUs: AboutContent;
  footer: {
    description: string;
    socialLinks: SocialLink[];
    shopLinks: FooterLink[];
    supportLinks: FooterLink[];
    copyright: string;
  };
  navigation: {
    links: FooterLink[];
    promoText: string;
  };
  policies: PolicyItem[];
  contactUs: {
    email: string;
    phone: string;
    address: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string | null;
  url: string;
  sortOrder: number;
  altText?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  compareAtPrice?: number | null;
  inventoryQuantity: number;
  imageUrl?: string | null;
  status: VariantStatus;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  inventory: number;
  colors: string[];
  sizes: string[];
  summary?: string;
  description?: string;
  category: string;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  seoTitle?: string;
  seoDescription?: string;
  details: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
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
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  name: string;
  color: string;
  size: string;
  image: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  customerName: string;
  customerEmail: string;
  status: FulfillmentStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  date: string;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  items: OrderItem[];
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  location: string;
  orders: number;
  spent: number;
  status: 'VIP' | 'Active' | 'New' | 'Guest';
  lastActive: string;
}

export interface CheckoutPayload {
  email: string;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: 'standard' | 'express';
  items: CartItem[];
}

export interface ContactMessageInput {
  firstName: string;
  lastName: string;
  email: string;
  orderNumber?: string;
  message: string;
}
