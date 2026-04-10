import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import AboutUs from '@/components/AboutUs';
import Auth from '@/components/Auth';
import Checkout from '@/components/Checkout';
import ContactUs from '@/components/ContactUs';
import Home from '@/components/Home';
import ProductDetails from '@/components/ProductDetails';
import Shop from '@/components/Shop';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AccountDashboard from '@/components/account/AccountDashboard';
import { StoreProvider, useStore } from '@/lib/store';

function AppMeta() {
  const { cmsContent } = useStore();

  useEffect(() => {
    document.title = cmsContent.seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', cmsContent.seo.description);
      return;
    }

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = cmsContent.seo.description;
    document.head.appendChild(meta);
  }, [cmsContent.seo]);

  return null;
}

function AuthenticatedRoute() {
  const { user, authLoading } = useStore();
  const location = useLocation();

  if (authLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function AdminRoute() {
  const { user, authLoading } = useStore();

  if (authLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}

function RoutedApp() {
  return (
    <>
      <AppMeta />
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<Checkout />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<AuthenticatedRoute />}>
            <Route path="/account" element={<AccountDashboard />} />
            <Route path="/account/orders" element={<AccountDashboard />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminDashboard />} />
            <Route path="/admin/customers" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <RoutedApp />
    </StoreProvider>
  );
}
