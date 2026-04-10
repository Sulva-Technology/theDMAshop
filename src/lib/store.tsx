import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { useLocation, useNavigate } from 'react-router-dom';

import { SEED_CMS_CONTENT, SEED_PRODUCTS } from '@/lib/seed-data';
import { fetchCMSContent, saveCMSContent } from '@/lib/services/cms';
import { submitContactMessage } from '@/lib/services/contact';
import { fetchAdminCustomers } from '@/lib/services/customers';
import { fetchAdminOrders, fetchOrdersForCurrentUser, updateOrderFulfillmentStatus } from '@/lib/services/orders';
import { archiveProduct, fetchProducts, upsertProduct } from '@/lib/services/products';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';
import type { CMSContent, CartItem, ContactMessageInput, CustomerSummary, Order, Product, Profile } from '@/lib/types';

const CART_STORAGE_KEY = 'thedmashop.cart';
const WISHLIST_STORAGE_KEY = 'thedmashop.wishlist';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
} | null;

type StoreContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  saveProduct: (product: Product) => Promise<void>;
  archiveProduct: (productId: string) => Promise<void>;
  productsLoading: boolean;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  user: User;
  profile: Profile | null;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authLoading: boolean;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus']) => Promise<void>;
  ordersLoading: boolean;
  customers: CustomerSummary[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerSummary[]>>;
  customersLoading: boolean;
  cmsContent: CMSContent;
  setCmsContent: React.Dispatch<React.SetStateAction<CMSContent>>;
  saveCmsContent: (content: CMSContent) => Promise<void>;
  contentLoading: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshAll: () => Promise<void>;
  submitContact: (payload: ContactMessageInput) => Promise<void>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function mapProfileToUser(profile: Profile | null): User {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    name: profile.fullName,
    email: profile.email,
    role: profile.role === 'admin' ? 'ADMIN' : 'CUSTOMER',
  };
}

function getRouteFromPage(page: string) {
  if (page.startsWith('/')) {
    return page;
  }

  switch (page) {
    case 'home':
      return '/';
    case 'shop':
      return '/shop';
    case 'checkout':
      return '/checkout';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'auth':
      return '/auth';
    case 'admin':
      return '/admin';
    case 'details':
      return '/shop';
    default:
      return '/';
  }
}

function getPageFromPath(pathname: string) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/shop')) return 'shop';
  if (pathname.startsWith('/products')) return 'details';
  if (pathname.startsWith('/checkout')) return 'checkout';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/contact')) return 'contact';
  if (pathname.startsWith('/auth')) return 'auth';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'home';
}

function loadStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, phone, default_address, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
    phone: data.phone ?? undefined,
    defaultAddress: data.default_address ?? null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => loadStoredJson(CART_STORAGE_KEY, [] as CartItem[]));
  const [wishlist, setWishlist] = useState<string[]>(() => loadStoredJson(WISHLIST_STORAGE_KEY, [] as string[]));
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [cmsContent, setCmsContent] = useState<CMSContent>(SEED_CMS_CONTENT);
  const [contentLoading, setContentLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      setProducts(await fetchProducts(Boolean(profile && profile.role === 'admin')));
    } finally {
      setProductsLoading(false);
    }
  }, [profile]);

  const refreshCMS = useCallback(async () => {
    setContentLoading(true);
    try {
      setCmsContent(await fetchCMSContent());
    } finally {
      setContentLoading(false);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      if (profile?.role === 'admin') {
        setOrders(await fetchAdminOrders());
      } else {
        setOrders(await fetchOrdersForCurrentUser(profile?.id));
      }
    } finally {
      setOrdersLoading(false);
    }
  }, [profile]);

  const refreshCustomers = useCallback(async () => {
    if (profile?.role !== 'admin') {
      setCustomers([]);
      setCustomersLoading(false);
      return;
    }

    setCustomersLoading(true);
    try {
      setCustomers(await fetchAdminCustomers());
    } finally {
      setCustomersLoading(false);
    }
  }, [profile]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshProducts(), refreshCMS(), refreshOrders(), refreshCustomers()]);
  }, [refreshProducts, refreshCMS, refreshOrders, refreshCustomers]);

  useEffect(() => {
    refreshProducts();
    refreshCMS();
  }, [refreshProducts, refreshCMS]);

  useEffect(() => {
    refreshOrders();
    refreshCustomers();
  }, [refreshOrders, refreshCustomers]);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      if (!hasSupabaseConfig || !supabase) {
        setAuthLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (session?.user) {
        const nextProfile = await fetchProfile(session.user.id);
        if (!active) {
          return;
        }
        setProfile(nextProfile);
        setUser(mapProfileToUser(nextProfile));
      }

      setAuthLoading(false);
    }

    initializeAuth();

    const subscription = supabase?.auth.onAuthStateChange(async (_event, session: Session | null) => {
      if (!session?.user) {
        setProfile(null);
        setUser(null);
        return;
      }

      const nextProfile = await fetchProfile(session.user.id);
      setProfile(nextProfile);
      setUser(mapProfileToUser(nextProfile));
    });

    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase auth is not configured.');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase auth is not configured.');
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) {
      setProfile(null);
      setUser(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    setProfile(null);
    setUser(null);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['fulfillmentStatus']) => {
    await updateOrderFulfillmentStatus(orderId, status);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status, fulfillmentStatus: status } : order,
      ),
    );
  }, []);

  const saveProduct = useCallback(async (product: Product) => {
    const saved = await upsertProduct(product);
    setProducts((prev) => {
      const exists = prev.some((item) => item.id === saved.id);
      return exists ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev];
    });
  }, []);

  const archiveProductById = useCallback(async (productId: string) => {
    await archiveProduct(productId);
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, []);

  const saveCms = useCallback(async (content: CMSContent) => {
    const saved = await saveCMSContent(content);
    setCmsContent(saved);
  }, []);

  const setCurrentPage = useCallback(
    (page: string) => {
      if (page === 'details' && selectedProductId) {
        const selectedProduct = products.find((product) => product.id === selectedProductId);
        if (selectedProduct) {
          navigate(`/products/${selectedProduct.slug}`);
          return;
        }
      }

      navigate(getRouteFromPage(page));
    },
    [navigate, products, selectedProductId],
  );

  const submitContact = useCallback(async (payload: ContactMessageInput) => {
    await submitContactMessage(payload);
  }, []);

  const value = useMemo<StoreContextType>(
    () => ({
      products,
      setProducts,
      saveProduct,
      archiveProduct: archiveProductById,
      productsLoading,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      user,
      profile,
      setUser,
      login,
      signUp,
      logout,
      authLoading,
      orders,
      setOrders,
      addOrder,
      updateOrderStatus,
      ordersLoading,
      customers,
      setCustomers,
      customersLoading,
      cmsContent,
      setCmsContent,
      saveCmsContent: saveCms,
      contentLoading,
      currentPage: getPageFromPath(location.pathname),
      setCurrentPage,
      selectedProductId,
      setSelectedProductId,
      refreshAll,
      submitContact,
    }),
    [
      products,
      saveProduct,
      archiveProductById,
      productsLoading,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      user,
      profile,
      login,
      signUp,
      logout,
      authLoading,
      orders,
      addOrder,
      updateOrderStatus,
      ordersLoading,
      customers,
      customersLoading,
      cmsContent,
      saveCms,
      contentLoading,
      location.pathname,
      setCurrentPage,
      selectedProductId,
      refreshAll,
      submitContact,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
}

export type { CMSContent, CartItem, CustomerSummary, Order, Product, Profile };
