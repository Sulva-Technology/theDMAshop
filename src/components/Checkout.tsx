import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronDown,
  ChevronUp,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLocation } from 'react-router-dom';
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
  
  // Form state
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = deliveryMethod === 'express' ? 15.00 : 0.00;
  const taxes = subtotal * 0.08; // 8% mock tax
  const total = subtotal + shippingCost + taxes;

  React.useEffect(() => {
    if (isSuccessRoute) {
      clearCart();
      setIsSuccess(true);
    }
  }, [clearCart, isSuccessRoute]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (!email || !email.includes('@')) {
      setEmailError(true);
      toast.error("Please enter a valid email address");
      return;
    }

    if (!firstName || !lastName) {
      toast.error("Please enter your name");
      return;
    }

    if (!address || !city || !state || !zip) {
      toast.error("Please complete your shipping address");
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
      
      {/* Mobile Order Summary Toggle */}
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

      {/* Left Column: Checkout Flow */}
      <div className="w-full lg:w-[55%] xl:w-[60%] p-6 md:p-12 lg:p-20 lg:pr-12 border-r border-border/50 pb-32 lg:pb-20">
        <div className="max-w-2xl mx-auto lg:ml-auto lg:mr-0 space-y-10">
          
          {/* Header & Progress */}
          <header className="space-y-6">
            <button onClick={() => setCurrentPage('home')} className="text-3xl font-heading font-bold text-primary tracking-tighter truncate w-full text-left">
                    theDMAshop
            </button>
            <nav className="flex flex-wrap items-center text-xs font-medium text-muted-foreground gap-2">
              <a href="#" className="hover:text-primary transition-colors">Cart</a>
              <ChevronRightIcon className="h-3 w-3 shrink-0" />
              <span className="text-foreground font-bold">Information</span>
              <ChevronRightIcon className="h-3 w-3 shrink-0" />
              <span>Shipping</span>
              <ChevronRightIcon className="h-3 w-3 shrink-0" />
              <span>Payment</span>
            </nav>
          </header>

          {/* Express Checkout / Auth */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold">Express checkout</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-xl bg-[#000000] text-white hover:bg-[#000000]/90 hover:text-white border-none premium-shadow-hover">
                <AppleIcon className="h-5 w-5 mr-2" />
                Pay
              </Button>
              <Button variant="outline" className="h-12 rounded-xl bg-white text-black hover:bg-gray-50 border-gray-200 premium-shadow-hover">
                <GoogleIcon className="h-5 w-5 mr-2" />
                Pay
              </Button>
            </div>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase tracking-widest font-bold">Or continue below</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>
          </section>

          {/* Contact Information (Guest vs Login) */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-heading font-bold">Contact</h2>
              <p className="text-sm text-muted-foreground">
                Have an account? <a href="#" className="text-primary font-bold hover:underline underline-offset-4">Log in</a>
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

          {/* Shipping Address */}
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

          {/* Delivery Method */}
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

          {/* Payment */}
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
              <div className="p-4 space-y-4 bg-secondary/5">
                <Input placeholder="Card number" className="h-14 rounded-xl bg-background border-border/50 focus-visible:ring-primary" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Expiration date (MM / YY)" className="h-14 rounded-xl bg-background border-border/50 focus-visible:ring-primary" />
                  <Input placeholder="Security code" className="h-14 rounded-xl bg-background border-border/50 focus-visible:ring-primary" />
                </div>
                <Input placeholder="Name on card" className="h-14 rounded-xl bg-background border-border/50 focus-visible:ring-primary" />
              </div>
            </div>
          </section>

          {/* Billing Address */}
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

          {/* Desktop CTA */}
          <div className="hidden lg:block pt-4">
            <Button 
              className="w-full h-16 rounded-2xl text-lg font-bold premium-shadow-hover gap-2"
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Pay ${total.toFixed(2)}
                </>
              )}
            </Button>
          </div>
          
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground pt-8 border-t border-border/50">
            <a href="#" className="hover:text-primary transition-colors">Refund policy</a>
            <a href="#" className="hover:text-primary transition-colors">Shipping policy</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of service</a>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary (Desktop) */}
      <div className="hidden lg:block w-full lg:w-[45%] xl:w-[40%] bg-secondary/20 p-6 md:p-12 lg:p-20 lg:pl-12">
        <div className="max-w-md mx-auto lg:ml-0 lg:mr-auto space-y-8 sticky top-12">
          
          <OrderSummaryItems items={cart} />
          <Separator />
          <DiscountCode />
          <Separator />
          <Totals subtotal={subtotal} shipping={shippingCost} taxes={taxes} total={total} />
          
          {/* Trust Signals */}
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

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 z-50">
        <Button 
          className="w-full h-14 rounded-xl text-lg font-bold premium-shadow gap-2"
          onClick={handleCheckout}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? (
            "Processing..."
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

// Sub-components for reusability between mobile/desktop summary views
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

// Icons
function ShoppingCartIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  )
}

function ChevronRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}

function AppleIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/w3.org/2000/svg">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
    </svg>
  )
}

function GoogleIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/w3.org/2000/svg">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  )
}
