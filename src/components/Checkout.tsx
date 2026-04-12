import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { POLICY_ROUTES } from '@/lib/policies';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

async function parseApiResponse(response: Response) {
  const raw = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (isJson) {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  return raw ? { error: raw } : null;
}

export default function Checkout() {
  const location = useLocation();
  const isSuccessRoute = location.pathname === '/checkout/success';
  const searchParams = new URLSearchParams(location.search);
  const orderNumber = searchParams.get('orderNumber');
  const { cart, clearCart, user, setCurrentPage } = useStore();
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = deliveryMethod === 'express' ? 15.0 : 0.0;
  const taxes = subtotal * 0.08;
  const total = subtotal + shippingCost + taxes;

  React.useEffect(() => {
    if (isSuccessRoute) {
      clearCart();
      setIsSuccess(true);
    }
  }, [clearCart, isSuccessRoute]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!email || !email.includes('@')) {
      setEmailError(true);
      toast.error('Please enter a valid email address');
      return;
    }

    if (!firstName || !lastName) {
      toast.error('Please enter your name');
      return;
    }

    if (!address || !city || !state || !zip) {
      toast.error('Please complete your shipping address');
      return;
    }

    setIsProcessing(true);
    try {
      const country = 'US';
      const payload = {
        email,
        shippingAddress: {
          firstName,
          lastName,
          line1: address,
          line2: '',
          city,
          state,
          postalCode: zip,
          country,
        },
        billingAddress: {
          firstName,
          lastName,
          line1: address,
          line2: '',
          city,
          state,
          postalCode: zip,
          country,
        },
        shippingMethod: deliveryMethod,
        items: cart,
      };

      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await parseApiResponse(response);
      if (!response.ok) {
        const message =
          typeof data?.error === 'string'
            ? data.error
            : 'Unable to create checkout session';
        throw new Error(message);
      }

      if (!data || typeof data.url !== 'string') {
        throw new Error('Checkout session did not return a valid redirect URL.');
      }

      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to start checkout');
      setIsProcessing(false);
      return;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6 max-w-md"
        >
          <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-heading font-bold">Thank you!</h1>
          <p className="text-muted-foreground text-lg">
            {orderNumber
              ? `Order ${orderNumber} has been placed successfully. We'll send you an email with your order details and tracking information shortly.`
              : "Your order has been placed successfully. We'll send you an email with your order details and tracking information shortly."}
          </p>
          <div className="pt-8">
            <Button
              className="w-full h-14 rounded-xl text-lg font-bold"
              onClick={() => setCurrentPage('home')}
            >
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-sans">
      <div className="lg:hidden bg-secondary/20 border-b border-border/50 sticky top-0 z-40">
        <button
          onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2 text-primary font-medium">
            <ShoppingCartIcon className="h-5 w-5" />
            {isOrderSummaryOpen ? 'Hide order summary' : 'Show order summary'}
            {isOrderSummaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          <span className="font-bold text-lg">${total.toFixed(2)}</span>
        </button>

        <AnimatePresence>
          {isOrderSummaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-background border-t border-border/50"
            >
              <div className="p-6 space-y-6">
                <OrderSummaryItems items={cart} />
                <Separator />
                <DiscountCode />
                <Separator />
                <Totals subtotal={subtotal} shipping={shippingCost} taxes={taxes} total={total} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full lg:w-[55%] xl:w-[60%] p-6 md:p-12 lg:p-20 lg:pr-12 border-r border-border/50 pb-32 lg:pb-20">
        <div className="max-w-2xl mx-auto lg:ml-auto lg:mr-0 space-y-10">
          <header className="space-y-6">
            <button onClick={() => setCurrentPage('home')} className="text-3xl font-heading font-bold text-primary tracking-tighter truncate w-full text-left">
              theDMAshop
            </button>
            <nav className="flex flex-wrap items-center text-xs font-medium text-muted-foreground gap-2">
              <button onClick={() => setCurrentPage('home')} className="hover:text-primary transition-colors">Cart</button>
              <ChevronRightIcon className="h-3 w-3 shrink-0" />
              <span className="text-foreground font-bold">Information</span>
              <ChevronRightIcon className="h-3 w-3 shrink-0" />
              <span>Shipping</span>
              <ChevronRightIcon className="h-3 w-3 shrink-0" />
              <span>Payment</span>
            </nav>
          </header>

          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-heading font-bold">Contact</h2>
              <p className="text-sm text-muted-foreground">
                Have an account? <Link to="/auth" className="text-primary font-bold hover:underline underline-offset-4">Log in</Link>
              </p>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(false);
                  }}
                  className={`h-14 rounded-xl bg-secondary/10 border-border/50 focus-visible:ring-primary ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  onBlur={(e) => setEmailError(!e.target.value.includes('@') && e.target.value.length > 0)}
                />
                {emailError && (
                  <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                )}
              </div>
              {emailError && <p className="text-xs text-red-500 font-medium">Please enter a valid email address.</p>}

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="marketing" defaultChecked />
                <Label htmlFor="marketing" className="text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email me with news and exclusive offers
                </Label>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-heading font-bold">Shipping address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-14 rounded-xl bg-secondary/10 border-border/50"
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-14 rounded-xl bg-secondary/10 border-border/50"
              />
              <Input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-14 rounded-xl bg-secondary/10 border-border/50 md:col-span-2"
              />
              <Input placeholder="Apartment, suite, etc. (optional)" className="h-14 rounded-xl bg-secondary/10 border-border/50 md:col-span-2" />
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-14 rounded-xl bg-secondary/10 border-border/50"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="h-14 rounded-xl bg-secondary/10 border-border/50"
                />
                <Input
                  placeholder="ZIP code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="h-14 rounded-xl bg-secondary/10 border-border/50"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-heading font-bold">Delivery method</h2>
            <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="gap-4">
              <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${deliveryMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-border/50 bg-secondary/10 hover:border-primary/50'}`} onClick={() => setDeliveryMethod('standard')}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="cursor-pointer">
                    <p className="font-bold">Standard Shipping</p>
                    <p className="text-xs text-muted-foreground mt-0.5">3-5 business days</p>
                  </Label>
                </div>
                <span className="font-bold text-sm">Free</span>
              </div>
              <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${deliveryMethod === 'express' ? 'border-primary bg-primary/5' : 'border-border/50 bg-secondary/10 hover:border-primary/50'}`} onClick={() => setDeliveryMethod('express')}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="cursor-pointer">
                    <p className="font-bold">Express Shipping</p>
                    <p className="text-xs text-muted-foreground mt-0.5">1-2 business days</p>
                  </Label>
                </div>
                <span className="font-bold text-sm">$15.00</span>
              </div>
            </RadioGroup>
          </section>

          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-heading font-bold">Payment</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> All transactions are secure and encrypted.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 overflow-hidden bg-secondary/10">
              <div className="p-4 border-b border-border/50 bg-background flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border-[5px] border-primary bg-white"></div>
                  <span className="font-bold">Credit card</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-6 w-10 bg-secondary rounded flex items-center justify-center"><CreditCard className="h-4 w-4 text-muted-foreground" /></div>
                </div>
              </div>
              <div className="p-5 bg-secondary/5 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Card details are entered on Stripe&apos;s secure hosted payment page.
                </p>
                <p className="text-sm text-muted-foreground">
                  When you click pay, we&apos;ll redirect you to Stripe to complete the transaction securely.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-heading font-bold">Billing address</h2>
            <div className="rounded-2xl border border-border/50 overflow-hidden bg-secondary/10">
              <div
                className="p-4 border-b border-border/50 bg-background flex items-center gap-3 cursor-pointer"
                onClick={() => setBillingSameAsShipping(true)}
              >
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${billingSameAsShipping ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {billingSameAsShipping && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                </div>
                <span className="font-medium text-sm">Same as shipping address</span>
              </div>
              <div
                className="p-4 bg-background flex items-center gap-3 cursor-pointer"
                onClick={() => setBillingSameAsShipping(false)}
              >
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${!billingSameAsShipping ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {!billingSameAsShipping && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                </div>
                <span className="font-medium text-sm">Use a different billing address</span>
              </div>
            </div>
          </section>

          <div className="hidden lg:block pt-4">
            <Button
              className="w-full h-16 rounded-2xl text-lg font-bold premium-shadow-hover gap-2"
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Pay ${total.toFixed(2)}
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground pt-8 border-t border-border/50">
            <Link to={POLICY_ROUTES.refund} className="hover:text-primary transition-colors">Refund policy</Link>
            <Link to={POLICY_ROUTES.shipping} className="hover:text-primary transition-colors">Shipping policy</Link>
            <Link to={POLICY_ROUTES.privacy} className="hover:text-primary transition-colors">Privacy policy</Link>
            <Link to={POLICY_ROUTES.terms} className="hover:text-primary transition-colors">Terms of service</Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-full lg:w-[45%] xl:w-[40%] bg-secondary/20 p-6 md:p-12 lg:p-20 lg:pl-12">
        <div className="max-w-md mx-auto lg:ml-0 lg:mr-auto space-y-8 sticky top-12">
          <OrderSummaryItems items={cart} />
          <Separator />
          <DiscountCode />
          <Separator />
          <Totals subtotal={subtotal} shipping={shippingCost} taxes={taxes} total={total} />

          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Secure, encrypted checkout</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              <span>Free standard shipping on orders over $200</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 z-50">
        <Button
          className="w-full h-14 rounded-xl text-lg font-bold premium-shadow gap-2"
          onClick={handleCheckout}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? (
            'Processing...'
          ) : (
            <>
              <Lock className="h-5 w-5" />
              Pay ${total.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function OrderSummaryItems({ items }: { items: any[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 items-center">
          <div className="relative h-16 w-16 shrink-0 rounded-xl bg-background border border-border/50 overflow-hidden premium-shadow-sm">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              {item.quantity}
            </div>
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="font-bold text-sm leading-tight truncate">{item.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.color} / {item.size}</p>
          </div>
          <p className="font-bold text-sm shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

function DiscountCode() {
  return (
    <div className="flex gap-2">
      <Input placeholder="Discount code or gift card" className="h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary" />
      <Button variant="secondary" className="h-12 rounded-xl px-6 font-bold hover:bg-primary hover:text-white transition-colors">Apply</Button>
    </div>
  );
}

function Totals({ subtotal, shipping, taxes, total }: { subtotal: number, shipping: number, taxes: number, total: number }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated taxes</span>
          <span className="font-medium">${taxes.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">Total</span>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">USD</span>
          <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function ShoppingCartIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
