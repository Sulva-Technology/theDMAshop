import type { CMSContent, CustomerSummary, Order, Product, Profile } from '@/lib/types';

export const SEED_CMS_CONTENT: CMSContent = {
  hero: {
    title: 'The Spring Collection',
    slogan: 'Elevate Your Everyday',
    description:
      'Discover our new arrivals featuring premium fabrics and minimal silhouettes designed for the modern wardrobe.',
    buttonText: 'Shop Collection',
    buttonLink: '/shop',
    image:
      'https://qlmumxqtifgbcttklfst.supabase.co/storage/v1/object/public/product-media/essential-ribbed-tank/white.jpeg',
  },
  aboutUs: {
    title: 'Our Philosophy',
    content:
      'At theDMAshop, we believe in the power of minimal design and premium craftsmanship. Our journey started with a simple idea: to create clothing that transcends seasons and trends. We source the finest materials and work with skilled artisans to bring you pieces that are not only beautiful but also built to last.',
    image:
      'https://qlmumxqtifgbcttklfst.supabase.co/storage/v1/object/public/product-media/essential-ribbed-tank/butter-yellow.jpeg',
  },
  footer: {
    description:
      'Redefining day-to-day luxury through minimal design and premium craftsmanship. Join our journey towards elevated living.',
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'Twitter', url: '#' },
      { platform: 'Facebook', url: '#' },
      { platform: 'Youtube', url: '#' },
    ],
    shopLinks: [
      { label: 'New Arrivals', url: '/shop' },
      { label: 'Best Sellers', url: '/shop' },
      { label: 'Essentials', url: '/shop' },
      { label: 'Outerwear', url: '/shop' },
      { label: 'Accessories', url: '/shop' },
    ],
    supportLinks: [
      { label: 'Shipping Policy', url: '#' },
      { label: 'Returns & Exchanges', url: '#' },
      { label: 'Track Your Order', url: '/account/orders' },
      { label: 'Size Guide', url: '#' },
      { label: 'Contact Us', url: '/contact' },
    ],
    copyright: '© 2026 theDMAshop. All rights reserved.',
  },
  navigation: {
    links: [
      { label: 'New Arrivals', url: '/shop' },
      { label: 'Shop', url: '/shop' },
      { label: 'Collections', url: '/shop' },
      { label: 'About', url: '/about' },
    ],
    promoText: 'Free worldwide shipping on orders over $200',
  },
  policies: [
    { title: 'Global Shipping', content: 'Fast, reliable delivery to over 50 countries worldwide.' },
    { title: 'Easy Returns', content: '30-day hassle-free return policy for your peace of mind.' },
    { title: 'Secure Shopping', content: 'Your data is protected with industry-leading encryption.' },
    { title: 'Flexible Payment', content: 'Multiple payment options including Apple Pay & Google Pay.' },
  ],
  contactUs: {
    email: 'support@thedmashop.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion Ave, New York, NY 10001',
  },
  seo: {
    title: 'theDMAshop | Premium Minimalist Fashion',
    description:
      'Redefining day-to-day luxury through minimal design and premium craftsmanship. Shop our latest collection of modern essentials.',
  },
};

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    slug: 'premium-cotton-tee',
    name: 'Premium Cotton Tee',
    price: 45,
    image: 'https://picsum.photos/seed/fashion-1/800/1000',
    inventory: 38,
    colors: ['Navy', 'White'],
    sizes: ['S', 'M'],
    summary: 'Soft premium cotton with a clean silhouette for everyday wear.',
    description:
      'A wardrobe staple cut from premium cotton jersey with a refined drape and durable construction.',
    category: 'Essentials',
    status: 'active',
    isFeatured: true,
    isNew: true,
    seoTitle: 'Premium Cotton Tee | theDMAshop',
    seoDescription: 'A premium cotton tee designed for comfort and longevity.',
    details: ['100% cotton', 'Relaxed fit', 'Machine wash cold'],
    images: [
      {
        id: 'img_1',
        productId: 'prod_1',
        url: 'https://picsum.photos/seed/fashion-1/800/1000',
        sortOrder: 0,
        altText: 'Premium Cotton Tee',
      },
    ],
    variants: [
      {
        id: 'var_1',
        productId: 'prod_1',
        sku: 'TEE-NAVY-S',
        color: 'Navy',
        size: 'S',
        price: 45,
        compareAtPrice: null,
        inventoryQuantity: 20,
        imageUrl: 'https://picsum.photos/seed/fashion-1/800/1000',
        status: 'active',
      },
      {
        id: 'var_2',
        productId: 'prod_1',
        sku: 'TEE-WHITE-M',
        color: 'White',
        size: 'M',
        price: 45,
        compareAtPrice: null,
        inventoryQuantity: 18,
        imageUrl: 'https://picsum.photos/seed/fashion-1/800/1000',
        status: 'active',
      },
    ],
  },
  {
    id: 'prod_2',
    slug: 'wool-blend-overcoat',
    name: 'Wool Blend Overcoat',
    price: 280,
    image: 'https://picsum.photos/seed/fashion-2/800/1000',
    inventory: 13,
    colors: ['Camel', 'Charcoal'],
    sizes: ['M', 'L'],
    summary: 'Tailored winter layering in a dense wool blend.',
    description:
      'A structured overcoat designed for elevated cold-weather dressing with clean lines and all-day comfort.',
    category: 'Outerwear',
    status: 'active',
    isFeatured: true,
    isNew: false,
    seoTitle: 'Wool Blend Overcoat | theDMAshop',
    seoDescription: 'A refined wool blend overcoat for modern wardrobes.',
    details: ['70% wool, 30% polyamide', 'Structured silhouette', 'Dry clean only'],
    images: [
      {
        id: 'img_2',
        productId: 'prod_2',
        url: 'https://picsum.photos/seed/fashion-2/800/1000',
        sortOrder: 0,
        altText: 'Wool Blend Overcoat',
      },
      {
        id: 'img_3',
        productId: 'prod_2',
        url: 'https://picsum.photos/seed/fashion-detail-1/800/1000',
        sortOrder: 1,
        altText: 'Overcoat detail',
      },
    ],
    variants: [
      {
        id: 'var_3',
        productId: 'prod_2',
        sku: 'COAT-CAMEL-M',
        color: 'Camel',
        size: 'M',
        price: 280,
        compareAtPrice: 320,
        inventoryQuantity: 8,
        imageUrl: 'https://picsum.photos/seed/fashion-2/800/1000',
        status: 'active',
      },
      {
        id: 'var_4',
        productId: 'prod_2',
        sku: 'COAT-CHARCOAL-L',
        color: 'Charcoal',
        size: 'L',
        price: 280,
        compareAtPrice: 320,
        inventoryQuantity: 5,
        imageUrl: 'https://picsum.photos/seed/fashion-2/800/1000',
        status: 'active',
      },
    ],
  },
  {
    id: 'prod_3',
    slug: 'structured-chino-pant',
    name: 'Structured Chino Pant',
    price: 85,
    image: 'https://picsum.photos/seed/fashion-3/800/1000',
    inventory: 22,
    colors: ['Beige'],
    sizes: ['32'],
    summary: 'Everyday chinos with a clean, modern taper.',
    description: 'Versatile chinos crafted for refined comfort and repeat wear.',
    category: 'Bottoms',
    status: 'active',
    isFeatured: false,
    isNew: true,
    seoTitle: 'Structured Chino Pant | theDMAshop',
    seoDescription: 'Clean and modern chino pants for daily wear.',
    details: ['Cotton blend', 'Tailored leg', 'Machine wash cold'],
    images: [
      {
        id: 'img_4',
        productId: 'prod_3',
        url: 'https://picsum.photos/seed/fashion-3/800/1000',
        sortOrder: 0,
        altText: 'Structured Chino Pant',
      },
    ],
    variants: [
      {
        id: 'var_5',
        productId: 'prod_3',
        sku: 'CHINO-BEIGE-32',
        color: 'Beige',
        size: '32',
        price: 85,
        compareAtPrice: null,
        inventoryQuantity: 22,
        imageUrl: 'https://picsum.photos/seed/fashion-3/800/1000',
        status: 'active',
      },
    ],
  },
];

export const SEED_ORDERS: Order[] = [];

export const SEED_CUSTOMERS: CustomerSummary[] = [
  { id: 'cust_1', name: 'Emma Thompson', email: 'emma.t@example.com', location: 'New York, NY', orders: 12, spent: 3450, status: 'VIP', lastActive: '2 hours ago' },
  { id: 'cust_2', name: 'James Wilson', email: 'james.w@example.com', location: 'London, UK', orders: 3, spent: 425, status: 'Active', lastActive: '1 day ago' },
];

export const SEED_ADMIN_PROFILE: Profile = {
  id: 'local-admin',
  email: 'admin@thedmashop.com',
  fullName: 'Store Admin',
  role: 'admin',
  phone: '+1 (555) 123-4567',
  defaultAddress: null,
};
