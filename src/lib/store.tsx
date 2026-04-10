import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---
export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string; // Main image
  images?: string[]; // Gallery images
  isNew: boolean;
  colors: string[];
  sizes: string[];
  inventory: number;
  summary?: string;
  description?: string;
  details?: string[];
};

export type CartItem = {
  id: string; // unique id for cart item (product.id + color + size)
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
} | null;

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: CartItem[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  location: string;
  orders: number;
  spent: number;
  status: 'VIP' | 'Active' | 'New' | 'Guest';
  lastActive: string;
};

export type CMSContent = {
  hero: {
    title: string;
    slogan: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
  };
  aboutUs: {
    title: string;
    content: string;
    image: string;
  };
  footer: {
    description: string;
    socialLinks: { platform: string; url: string }[];
    shopLinks: { label: string; url: string }[];
    supportLinks: { label: string; url: string }[];
    copyright: string;
  };
  navigation: {
    links: { label: string; url: string }[];
    promoText: string;
  };
  policies: {
    title: string;
    content: string;
  }[];
  contactUs: {
    email: string;
    phone: string;
    address: string;
  };
  seo: {
    title: string;
    description: string;
  };
};

// --- Initial Mock Data ---
const INITIAL_CMS_CONTENT: CMSContent = {
  hero: {
    title: "The Spring Collection",
    slogan: "Elevate Your Everyday",
    description: "Discover our new arrivals featuring premium fabrics and minimal silhouettes designed for the modern wardrobe.",
    buttonText: "Shop Collection",
    buttonLink: "shop",
    image: "https://picsum.photos/seed/hero-fashion/1920/1080"
  },
  aboutUs: {
    title: "Our Philosophy",
    content: "At theDMAshop, we believe in the power of minimal design and premium craftsmanship. Our journey started with a simple idea: to create clothing that transcends seasons and trends. We source the finest materials and work with skilled artisans to bring you pieces that are not only beautiful but also built to last.",
    image: "https://picsum.photos/seed/editorial-fashion/1000/1200"
  },
  footer: {
    description: "Redefining day-to-day luxury through minimal design and premium craftsmanship. Join our journey towards elevated living.",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Twitter", url: "#" },
      { platform: "Facebook", url: "#" },
      { platform: "Youtube", url: "#" }
    ],
    shopLinks: [
      { label: "New Arrivals", url: "shop" },
      { label: "Best Sellers", url: "shop" },
      { label: "Essentials", url: "shop" },
      { label: "Outerwear", url: "shop" },
      { label: "Accessories", url: "shop" }
    ],
    supportLinks: [
      { label: "Shipping Policy", url: "#" },
      { label: "Returns & Exchanges", url: "#" },
      { label: "Track Your Order", url: "#" },
      { label: "Size Guide", url: "#" },
      { label: "Contact Us", url: "contact" }
    ],
    copyright: "© 2026 theDMAshop. All rights reserved."
  },
  navigation: {
    links: [
      { label: "New Arrivals", url: "shop" },
      { label: "Shop", url: "shop" },
      { label: "Collections", url: "shop" },
      { label: "About", url: "about" }
    ],
    promoText: "Free worldwide shipping on orders over $200"
  },
  policies: [
    { title: "Global Shipping", content: "Fast, reliable delivery to over 50 countries worldwide." },
    { title: "Easy Returns", content: "30-day hassle-free return policy for your peace of mind." },
    { title: "Secure Shopping", content: "Your data is protected with industry-leading encryption." },
    { title: "Flexible Payment", content: "Multiple payment options including Apple Pay & Google Pay." }
  ],
  contactUs: {
    email: "support@thedmashop.com",
    phone: "+1 (555) 123-4567",
    address: "123 Fashion Ave, New York, NY 10001"
  },
  seo: {
    title: "theDMAshop | Premium Minimalist Fashion",
    description: "Redefining day-to-day luxury through minimal design and premium craftsmanship. Shop our latest collection of modern essentials."
  }
};

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'CUS-001', name: 'Emma Thompson', email: 'emma.t@example.com', location: 'New York, NY', orders: 12, spent: 3450.00, status: 'VIP', lastActive: '2 hours ago' },
  { id: 'CUS-002', name: 'James Wilson', email: 'james.w@example.com', location: 'London, UK', orders: 3, spent: 425.00, status: 'Active', lastActive: '1 day ago' },
  { id: 'CUS-003', name: 'Sophia Chen', email: 'sophia.c@example.com', location: 'San Francisco, CA', orders: 1, spent: 890.00, status: 'New', lastActive: '3 days ago' },
  { id: 'CUS-004', name: 'Lucas Garcia', email: 'lucas.g@example.com', location: 'Miami, FL', orders: 0, spent: 0.00, status: 'Guest', lastActive: '1 week ago' },
  { id: 'CUS-005', name: 'Mia Robinson', email: 'mia.r@example.com', location: 'Chicago, IL', orders: 5, spent: 1240.00, status: 'Active', lastActive: '2 weeks ago' },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "Premium Cotton Tee",
    price: 45.00,
    category: "Essentials",
    image: "https://picsum.photos/seed/fashion-1/800/1000",
    isNew: true,
    colors: ["Navy", "White", "Black"],
    sizes: ["S", "M", "L", "XL"],
    inventory: 100
  },
  {
    id: '2',
    name: "Wool Blend Overcoat",
    price: 280.00,
    category: "Outerwear",
    image: "https://picsum.photos/seed/fashion-2/800/1000",
    isNew: false,
    colors: ["Camel", "Charcoal"],
    sizes: ["M", "L", "XL"],
    inventory: 50
  },
  {
    id: '3',
    name: "Structured Chino Pant",
    price: 85.00,
    category: "Bottoms",
    image: "https://picsum.photos/seed/fashion-3/800/1000",
    isNew: true,
    colors: ["Beige", "Navy"],
    sizes: ["30", "32", "34"],
    inventory: 75
  },
  {
    id: '4',
    name: "Merino Wool Sweater",
    price: 120.00,
    category: "Essentials",
    image: "https://picsum.photos/seed/fashion-4/800/1000",
    isNew: false,
    colors: ["Forest", "Navy", "Gray"],
    sizes: ["S", "M", "L"],
    inventory: 20
  }
];

const INITIAL_ORDERS: Order[] = [
  { id: '#ORD-001', customerName: 'Emma Thompson', customerEmail: 'emma@example.com', date: new Date().toISOString(), status: 'Processing', total: 325.00, items: [] },
  { id: '#ORD-002', customerName: 'James Wilson', customerEmail: 'james@example.com', date: new Date(Date.now() - 86400000).toISOString(), status: 'Shipped', total: 145.00, items: [] },
];

// --- Context ---
interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[]; // array of product ids
  toggleWishlist: (productId: string) => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  login: (userData: User) => void;
  logout: () => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  cmsContent: CMSContent;
  setCmsContent: React.Dispatch<React.SetStateAction<CMSContent>>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [cmsContent, setCmsContent] = useState<CMSContent>(INITIAL_CMS_CONTENT);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <StoreContext.Provider value={{
      products, setProducts,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      wishlist, toggleWishlist,
      user, setUser, login, logout,
      orders, setOrders, addOrder, updateOrderStatus,
      customers, setCustomers,
      cmsContent, setCmsContent,
      currentPage, setCurrentPage,
      selectedProductId, setSelectedProductId
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
