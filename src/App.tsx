import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { StoreProvider, useStore } from './lib/store';
import Home from './components/Home';
import Shop from './components/Shop';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Auth from './components/Auth';
import AdminDashboard from './components/admin/AdminDashboard';

function AppContent() {
  const { currentPage, setCurrentPage, cmsContent } = useStore();

  useEffect(() => {
    document.title = cmsContent.seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', cmsContent.seo.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = cmsContent.seo.description;
      document.head.appendChild(meta);
    }
  }, [cmsContent.seo]);

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'home' && <Home />}
      {currentPage === 'shop' && <Shop />}
      {currentPage === 'details' && <ProductDetails />}
      {currentPage === 'checkout' && <Checkout />}
      {currentPage === 'about' && <AboutUs />}
      {currentPage === 'contact' && <ContactUs />}
      {currentPage === 'auth' && <Auth />}
      {currentPage === 'admin' && <AdminDashboard />}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
      <Toaster position="top-center" />
    </StoreProvider>
  );
}
