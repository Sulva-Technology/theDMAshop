import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Search, ShoppingCart, Heart, User, LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, ChevronRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '@/lib/store';

export default function DesignSystem() {
  const { setCurrentPage } = useStore();
  return (
    <div className="min-h-screen bg-background p-8 md:p-16 space-y-24 max-w-7xl mx-auto">
      {/* Header */}
      <section className="space-y-4">
        <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-widest font-medium">Design System v1.0</Badge>
              <h1 className="text-6xl font-heading font-bold text-primary">theDMAshop</h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          A unified visual language for a premium fashion e-commerce experience. 
          Balanced between luxury elegance and technical precision.
        </p>
      </section>

      <Separator />

      {/* 1. Visual Identity & Colors */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-heading font-semibold">Visual Identity</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Our identity is built on three pillars: <strong>Clarity</strong>, <strong>Premium Quality</strong>, and <strong>Modernity</strong>.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Clean grids and generous whitespace</li>
              <li>Soft shadows and subtle rounded corners (12px)</li>
              <li>Premium typography (Outfit for headings, Inter for UI)</li>
              <li>Restrained use of glassmorphism</li>
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-heading font-semibold">Color System</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-20 w-full bg-primary rounded-xl premium-shadow"></div>
              <p className="text-sm font-medium">Primary (Navy)</p>
              <p className="text-xs text-muted-foreground">oklch(0.25 0.05 250)</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 w-full bg-secondary rounded-xl border border-border"></div>
              <p className="text-sm font-medium">Secondary (Gray-Blue)</p>
              <p className="text-xs text-muted-foreground">oklch(0.95 0.01 250)</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 w-full bg-background rounded-xl border border-border"></div>
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-muted-foreground">oklch(0.99 0.005 250)</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 w-full bg-foreground rounded-xl"></div>
              <p className="text-sm font-medium">Foreground</p>
              <p className="text-xs text-muted-foreground">oklch(0.15 0.02 250)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Typography */}
      <section className="space-y-8">
        <h2 className="text-3xl font-heading font-semibold">Typography System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Heading / Outfit Variable</p>
              <h3 className="text-5xl font-heading font-bold">The quick brown fox</h3>
              <h3 className="text-4xl font-heading font-semibold">The quick brown fox</h3>
              <h3 className="text-3xl font-heading font-medium">The quick brown fox</h3>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Body / Inter Variable</p>
              <p className="text-lg leading-relaxed">
                Experience the pinnacle of modern fashion. Our collection is curated for those who appreciate 
                the finer details in day-to-day wear.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Experience the pinnacle of modern fashion. Our collection is curated for those who appreciate 
                the finer details in day-to-day wear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Buttons & Interactive */}
      <section className="space-y-8">
        <h2 className="text-3xl font-heading font-semibold">Interactive Elements</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="lg" className="rounded-full px-8 premium-shadow-hover">Shop Collection</Button>
          <Button variant="secondary" size="lg" className="rounded-full px-8">Learn More</Button>
          <Button variant="outline" size="lg" className="rounded-full px-8">View Details</Button>
          <Button variant="ghost" size="lg" className="rounded-full px-8">Sign In</Button>
          <Button size="icon" variant="outline" className="rounded-full h-12 w-12">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full h-12 w-12">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* 4. Product Card System (Apple-style) */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-semibold">Product Card System</h2>
            <p className="text-muted-foreground">Apple-inspired minimalist product presentation.</p>
          </div>
          <Button variant="link" className="group">
            View all products <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary mb-4 premium-shadow-hover">
                <img 
                  src={`https://picsum.photos/seed/fashion-${i}/800/1000`} 
                  alt="Product" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <Button size="icon" variant="secondary" className="rounded-full glass h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                {i === 1 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-black hover:bg-white/90 rounded-full px-3">New Arrival</Badge>
                  </div>
                )}
              </div>
              <div className="space-y-1 px-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">Premium {i === 1 ? 'Cotton Tee' : 'Wool Overcoat'}</h3>
                  <p className="font-semibold text-primary">${i === 1 ? '45.00' : '280.00'}</p>
                </div>
                <p className="text-sm text-muted-foreground">Essential Collection</p>
                <div className="flex items-center gap-1 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">(24)</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Admin Dashboard Language */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-heading font-semibold">Admin Dashboard Language</h2>
          <p className="text-muted-foreground">Efficient, scannable, and professional analytics-driven interface.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-shadow border-none overflow-hidden">
            <CardHeader className="bg-secondary/30 border-b border-border/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly performance analytics</CardDescription>
                </div>
                <Tabs defaultValue="7d">
                  <TabsList className="rounded-full">
                    <TabsTrigger value="7d" className="rounded-full">7d</TabsTrigger>
                    <TabsTrigger value="30d" className="rounded-full">30d</TabsTrigger>
                    <TabsTrigger value="90d" className="rounded-full">90d</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full bg-secondary/20 rounded-xl flex items-end justify-between p-8 gap-4">
                {[40, 70, 45, 90, 65, 85, 55, 75, 50, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.8 }}
                    className="w-full bg-primary/80 rounded-t-md relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${h * 120}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="premium-shadow border-none">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Total Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12,482</div>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="premium-shadow border-none">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  Active Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-xs text-muted-foreground mt-1">24 pending fulfillment</p>
              </CardContent>
            </Card>
            <Card className="premium-shadow border-none">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.2%</div>
                <p className="text-xs text-red-500 mt-1">-0.4% from last week</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Navigation & Layout */}
      <section className="space-y-8">
        <h2 className="text-3xl font-heading font-semibold">Navigation Styles</h2>
        <div className="space-y-12">
          {/* Main Storefront Nav */}
          <div className="p-6 bg-white rounded-3xl premium-shadow flex items-center justify-between">
            <button onClick={() => setCurrentPage('home')} className="text-2xl font-heading font-bold text-primary">theDMAshop</button>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">New Arrivals</button>
              <button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">Shop</button>
              <button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">Collections</button>
              <button onClick={() => setCurrentPage('about')} className="hover:text-primary transition-colors">About</button>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">2</span>
              </Button>
            </div>
          </div>

          {/* Admin Sidebar Snippet */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 bg-secondary/30 rounded-3xl p-6 space-y-6 border border-border/50">
              <div className="text-xl font-heading font-bold px-2">DMA Admin</div>
              <nav className="space-y-1">
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', active: true },
                  { icon: Package, label: 'Products' },
                  { icon: ShoppingBag, label: 'Orders' },
                  { icon: Users, label: 'Customers' },
                  { icon: BarChart3, label: 'Analytics' },
                  { icon: Settings, label: 'Settings' },
                ].map((item, i) => (
                  <Button 
                    key={i} 
                    variant={item.active ? 'secondary' : 'ghost'} 
                    className={`w-full justify-start gap-3 rounded-xl ${item.active ? 'bg-white premium-shadow' : ''}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>
            <div className="md:col-span-3 bg-white rounded-3xl p-8 premium-shadow border border-border/50 flex items-center justify-center text-muted-foreground italic">
              Admin Content Area
            </div>
          </div>
        </div>
      </section>

      {/* Footer Snippet */}
      <footer className="pt-16 pb-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <button onClick={() => setCurrentPage('home')} className="text-2xl font-heading font-bold text-primary">theDMAshop</button>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Redefining day-to-day luxury through minimal design and premium craftsmanship.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">New Arrivals</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">Best Sellers</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">Essentials</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-primary transition-colors">Contact Us</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Newsletter</h4>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="rounded-full bg-secondary/50 border-none px-4" />
              <Button className="rounded-full px-6">Join</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/50 text-xs text-muted-foreground uppercase tracking-widest">
              <p>© 2026 theDMAshop. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
