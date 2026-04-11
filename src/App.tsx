import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import AboutUs from '@/components/AboutUs';
import Auth from '@/components/Auth';
import Checkout from '@/components/Checkout';
import ContactUs from '@/components/ContactUs';
import Home from '@/components/Home';
import InfoPage from '@/components/InfoPage';
import NotFound from '@/components/NotFound';
import ProductDetails from '@/components/ProductDetails';
import Shop from '@/components/Shop';
import { Seo } from '@/components/Seo';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AccountDashboard from '@/components/account/AccountDashboard';
import { StoreProvider, useStore } from '@/lib/store';

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
      <Seo
        title="theDMAshop | Premium Minimal Essentials"
        description="Shop premium minimalist clothing, modern wardrobe essentials, and elevated everyday fashion from theDMAshop."
        canonicalPath="/"
        keywords={['minimalist fashion', 'premium essentials', 'modern clothing', 'theDMAshop']}
      />
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<Checkout />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shipping-policy" element={<InfoPage path="/shipping-policy" eyebrow="Support" title="Shipping Policy" intro="Everything you need to know about how we process, pack, and deliver your order." sections={[
            { heading: 'Order Processing', body: ['Orders are reviewed and prepared within 1 to 2 business days. During launch periods or holidays, processing can take a little longer, but we always show your latest order status inside your account dashboard.'] },
            { heading: 'Delivery Windows', body: ['Standard shipping usually arrives within 3 to 5 business days after dispatch. Expedited delivery options may be available at checkout depending on destination and inventory location.'] },
            { heading: 'International Shipping', body: ['We can ship internationally where carrier coverage allows. Duties, taxes, and any import fees are determined by your local customs authority and are the customer’s responsibility unless otherwise stated at checkout.'] },
          ]} />} />
          <Route path="/returns-exchanges" element={<InfoPage path="/returns-exchanges" eyebrow="Support" title="Returns & Exchanges" intro="We want every order to feel easy to shop and easy to return if it is not the right fit." sections={[
            { heading: 'Return Window', body: ['Eligible items can be returned within 30 days of delivery as long as they are unworn, unwashed, and sent back with original tags and packaging. Final sale items are not returnable unless they arrive damaged.'] },
            { heading: 'Exchanges', body: ['If you need a different size, contact support with your order number and preferred replacement. We will help you exchange available items as quickly as possible.'] },
            { heading: 'Refund Timing', body: ['Once your return is received and inspected, approved refunds are issued to the original payment method. Bank processing times vary, but most refunds appear within 5 to 10 business days.'] },
          ]} />} />
          <Route path="/size-guide" element={<InfoPage path="/size-guide" eyebrow="Support" title="Size Guide" intro="Use this guide to choose the best fit before placing your order." sections={[
            { heading: 'How To Measure', body: ['Measure your chest, waist, and hips with a soft tape while wearing light clothing. Compare those measurements with the product notes on each item page for the best result.'] },
            { heading: 'Fit Notes', body: ['Pieces marked relaxed fit are designed with extra room through the body, while tailored items are cut closer for a sharper silhouette. When between sizes, we usually recommend sizing up for outerwear and sizing true for knit basics.'] },
            { heading: 'Need Help?', body: ['If you want a second opinion before ordering, use the contact form and include the item name plus your usual size. Our team can recommend the best fit based on the garment shape.'] },
          ]} />} />
          <Route path="/privacy-policy" element={<InfoPage path="/privacy-policy" eyebrow="Legal" title="Privacy Policy" intro="This page explains what information we collect, why we collect it, and how we use it to operate the store." sections={[
            { heading: 'Information We Collect', body: ['We collect the details you provide during checkout, account creation, newsletter signup, and support requests. This can include your name, email address, shipping details, and order activity.'] },
            { heading: 'How We Use It', body: ['We use your information to fulfill purchases, provide customer support, improve store performance, and send updates you have requested such as newsletters or order notifications.'] },
            { heading: 'Your Choices', body: ['You can contact support at any time to update or remove account information where applicable. Marketing emails always include an unsubscribe option.'] },
          ]} />} />
          <Route path="/terms-of-service" element={<InfoPage path="/terms-of-service" eyebrow="Legal" title="Terms of Service" intro="These terms describe the rules and expectations that apply when using the store." sections={[
            { heading: 'Using the Store', body: ['By placing an order or creating an account, you agree to provide accurate information and to use the site only for lawful purchases and communications.'] },
            { heading: 'Orders and Availability', body: ['All orders are subject to stock availability and payment approval. We may cancel or adjust orders affected by pricing errors, fraud checks, or inventory mismatches.'] },
            { heading: 'Content and Liability', body: ['Product descriptions and imagery are presented as accurately as possible, but minor variations can occur. To the fullest extent permitted by law, liability is limited to the amount paid for the relevant order.'] },
          ]} />} />
          <Route path="/cookie-settings" element={<InfoPage path="/cookie-settings" eyebrow="Legal" title="Cookie Settings" intro="Cookies help us keep the storefront secure, remember preferences, and understand how the site is being used." sections={[
            { heading: 'Essential Cookies', body: ['Essential cookies support features like cart persistence, authentication, and secure checkout. These are required for the storefront to function correctly.'] },
            { heading: 'Analytics and Preferences', body: ['Depending on your deployment, additional cookies may be used to understand usage patterns or remember non-essential preferences.'] },
            { heading: 'Managing Cookies', body: ['You can control cookies through your browser settings. Disabling some cookies may limit core store functionality such as account access or checkout flow.'] },
          ]} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-login" element={<Navigate to="/auth" replace state={{ from: '/admin' }} />} />
          
          <Route path="/account" element={<AuthenticatedRoute />}>
            <Route index element={<AccountDashboard />} />
            <Route path="orders" element={<AccountDashboard />} />
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminDashboard />} />
            <Route path="customers" element={<AdminDashboard />} />
            <Route path="content" element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
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
