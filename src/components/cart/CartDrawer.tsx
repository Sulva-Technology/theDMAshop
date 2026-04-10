import React from 'react';
import { ShoppingCart, X, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useStore } from '@/lib/store';

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateCartQuantity, setCurrentPage } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsOpen(false);
    setCurrentPage('checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 sm:border-l border-border">
        <SheetHeader className="p-6 border-b border-border/50">
          <SheetTitle className="text-2xl font-heading font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                
                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-medium text-sm leading-tight line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{item.color} / {item.size}</p>
                    </div>
                    <button 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center bg-secondary/30 rounded-full px-2 border border-border h-8">
                      <button 
                        className="h-full px-1 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        className="h-full px-1 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-secondary/10 border-t border-border/50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-xs uppercase tracking-widest font-bold text-primary">Calculated at checkout</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">${subtotal.toFixed(2)}</span>
            </div>
            
            <Button 
              className="w-full rounded-full h-14 text-lg font-bold premium-shadow-hover gap-2 group"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-center text-xs text-muted-foreground mt-4">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
