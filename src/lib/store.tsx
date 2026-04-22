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

import { EMPTY_CMS_CONTENT } from '@/lib/defaults';
import { fetchCMSContent, saveCMSContent } from '@/lib/services/cms';
import { submitContactMessage } from '@/lib/services/contact';
import { fetchAdminCustomers } from '@/lib/services/customers';
import { subscribeToNewsletter } from '@/lib/services/newsletter';
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
  productsError: string | null;
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
  login: (email: string, password: string) => Promise<User>;
  signUp: (fullName: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  authLoading: boolean;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus']) => Promise<void>;
  ordersLoading: boolean;
  ordersError: string | null;
  customers: CustomerSummary[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerSummary[]>>;
  customersLoading: boolean;
  customersError: string | null;
  cmsContent: CMSContent;
  setCmsContent: React.Dispatch<React.SetStateAction<CMSContent>>;
  saveCmsContent: (content: CMSContent) => Promise<void>;
  contentLoading: boolean;
  contentError: string | null;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshAll: () => Promise<void>;
  submitContact: (payload: ContactMessageInput) => Promise<void>;
  submitNewsletter: (email: string) => Promise<void>;
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
    role: profile.role?.toLowerCase() === 'admin' ? 'ADMIN' : 'CUSTOMER',
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
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  if (cleanPath === '/') return 'home';
  if (cleanPath.startsWith('/shop')) return 'shop';
  if (cleanPath.startsWith('/products')) return 'details';
  if (cleanPath.startsWith('/checkout')) return 'checkout';
  if (cleanPath.startsWith('/about')) return 'about';
  if (cleanPath.startsWith('/contact')) return 'contact';
  if (cleanPath.startsWith('/auth')) return 'auth';
  if (cleanPath.startsWith('/admin')) return 'admin';
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

async function resolveUserFromSession(userId: string) {
  const nextProfile = await fetchProfile(userId);
  return {
    profile: nextProfile,
    user: mapProfileToUser(nextProfile),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => loadStoredJson(CART_STORAGE_KEY, [] as CartItem[]));
  const [wishlist, setWishlist] = useState<string[]>(() => loadStoredJson(WISHLIST_STORAGE_KEY, [] as string[]));
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [cmsContent, setCmsContent] = useState<CMSContent>(EMPTY_CMS_CONTENT);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (products.length === 0) {
      return;
    }

    setCart((prev) =>
      prev.filter((item) =>
        products.some(
          (product) =>
            product.id === item.productId &&
            product.variants.some((variant) => variant.id === item.variantId && variant.status === 'active'),
        ),
      ),
    );
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      setProductsError(null);
      setProducts(await fetchProducts(Boolean(profile && profile.role === 'admin')));
    } catch (error: any) {
      setProducts([]);
      setProductsError(error?.message ?? 'Unable to load products from Supabase.');
    } finally {
      setProductsLoading(false);
    }
  }, [profile]);

  const refreshCMS = useCallback(async () => {
    setContentLoading(true);
    try {
      setContentError(null);
      setCmsContent(await fetchCMSContent());
    } catch (error: any) {
      setCmsContent(EMPTY_CMS_CONTENT);
      setContentError(error?.message ?? 'Unable to load storefront content from Supabase.');
    } finally {
      setContentLoading(false);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      setOrdersError(null);
      if (profile?.role === 'admin') {
        setOrders(await fetchAdminOrders());
      } else {
        setOrders(await fetchOrdersForCurrentUser(profile?.id));
      }
    } catch (error: any) {
      setOrders([]);
      setOrdersError(error?.message ?? 'Unable to load orders from Supabase.');
    } finally {
      setOrdersLoading(false);
    }
  }, [profile]);

  const refreshCustomers = useCallback(async () => {
    if (profile?.role !== 'admin') {
      setCustomers([]);
      setCustomersLoading(false);
      setCustomersError(null);
      return;
    }

    setCustomersLoading(true);
    try {
      setCustomersError(null);
      setCustomers(await fetchAdminCustomers());
    } catch (error: any) {
      setCustomers([]);
      setCustomersError(error?.message ?? 'Unable to load customers from Supabase.');
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
        const { profile: nextProfile, user: nextUser } = await resolveUserFromSession(session.user.id);
        if (!active) {
          return;
        }
        setProfile(nextProfile);
        setUser(nextUser);
      } else {
        setProfile(null);
        setUser(null);
      }

      setAuthLoading(false);
    }

    initializeAuth();

    const subscription = supabase?.auth.onAuthStateChange(async (_event, session: Session | null) => {
      if (!session?.user) {
        setProfile(null);
        setUser(null);
        setAuthLoading(false);
        return;
      }

      const { profile: nextProfile, user: nextUser } = await resolveUserFromSession(session.user.id);
      setProfile(nextProfile);
      setUser(nextUser);
      setAuthLoading(false);
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

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }

    if (data.session?.user) {
      const { profile: nextProfile, user: userObj } = await resolveUserFromSession(data.session.user.id);
      setProfile(nextProfile);
      setUser(userObj);
      return userObj;
    }
    return null;
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase auth is not configured.');
    }

    const { data, error } = await supabase.auth.signUp({
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

    if (data.session?.user) {
      const { profile: nextProfile, user: userObj } = await resolveUserFromSession(data.session.user.id);
      setProfile(nextProfile);
      setUser(userObj);
      return userObj;
    }
    return null;
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

  const submitNewsletter = useCallback(async (email: string) => {
    await subscribeToNewsletter(email);
  }, []);

  const value = useMemo<StoreContextType>(
    () => ({
      products,
      setProducts,
      saveProduct,
      archiveProduct: archiveProductById,
      productsLoading,
      productsError,
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
      ordersError,
      customers,
      setCustomers,
      customersLoading,
      customersError,
      cmsContent,
      setCmsContent,
      saveCmsContent: saveCms,
      contentLoading,
      contentError,
      currentPage: getPageFromPath(location.pathname),
      setCurrentPage,
      selectedProductId,
      setSelectedProductId,
      refreshAll,
      submitContact,
      submitNewsletter,
    }),
    [
      products,
      saveProduct,
      archiveProductById,
      productsLoading,
      productsError,
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
      ordersError,
      customers,
      customersLoading,
      customersError,
      cmsContent,
      saveCms,
      contentLoading,
      contentError,
      location.pathname,
      setCurrentPage,
      selectedProductId,
      refreshAll,
      submitContact,
      submitNewsletter,
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
