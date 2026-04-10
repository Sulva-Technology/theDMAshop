import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, user, logout, setCurrentPage, cmsContent } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="w-full bg-primary text-primary-foreground py-2 px-4 text-center text-xs uppercase tracking-widest font-medium z-50 relative truncate">
        {cmsContent.navigation.promoText}
      </div>
      <header 
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? 'glass py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <button onClick={() => setCurrentPage('home')} className="text-2xl font-heading font-bold text-primary tracking-tighter">
              theDMAshop
            </button>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {cmsContent.navigation.links.map((link, index) => (
                <button key={index} onClick={() => setCurrentPage(link.url)} className="hover:text-primary transition-colors">{link.label}</button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => setCurrentPage('admin')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => setCurrentPage('auth')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg cursor-pointer text-red-600 focus:text-red-600" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex" onClick={() => setCurrentPage('auth')}>
                <User className="h-5 w-5" />
              </Button>
            )}

            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            <CartDrawer>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Button>
            </CartDrawer>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-heading font-bold text-primary">theDMAshop</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-8 text-2xl font-heading font-semibold">
                {cmsContent.navigation.links.map((link, index) => (
                  <button key={index} onClick={() => { setIsMobileMenuOpen(false); setCurrentPage(link.url); }} className="text-left">{link.label}</button>
                ))}
              </nav>
              <div className="mt-auto pt-8 border-t border-border space-y-4">
                {user ? (
                  <Button variant="outline" className="w-full rounded-full py-6 text-lg" onClick={() => { setIsMobileMenuOpen(false); logout(); }}>Log Out</Button>
                ) : (
                  <Button className="w-full rounded-full py-6 text-lg" onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('auth'); }}>Sign In</Button>
                )}
                <div className="flex justify-center gap-8 text-muted-foreground">
                  <Search className="h-6 w-6" />
                  <User className="h-6 w-6" />
                  <Heart className="h-6 w-6" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
