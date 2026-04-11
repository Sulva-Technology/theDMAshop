import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronDown,
  LayoutGrid,
  StretchHorizontal,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Seo } from '@/components/Seo';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import {
  buildCartItem,
  getAvailableCategories,
  getAvailableColors,
  getAvailableSizes,
  getDefaultVariant,
  getPriceRange,
} from '@/lib/product-helpers';
import { buildBreadcrumbList } from '@/lib/seo';
import type { Product } from '@/lib/types';
import { toast } from 'sonner';

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, productsLoading, productsError, addToCart, wishlist, toggleWishlist } = useStore();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const derivedPriceRange = useMemo(() => getPriceRange(products), [products]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  React.useEffect(() => {
    setPriceRange(derivedPriceRange);
  }, [derivedPriceRange[0], derivedPriceRange[1]]);

  React.useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  React.useEffect(() => {
    if (searchParams.get('focus') !== 'search') {
      return;
    }

    const input = document.getElementById('shop-search-input');
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.select();
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('focus');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const categories = useMemo(() => ['All', ...getAvailableCategories(products)], [products]);
  const sizes = useMemo(() => getAvailableSizes(products), [products]);
  const colors = useMemo(() => getAvailableColors(products), [products]);
  const isWishlistView = searchParams.get('wishlist') === '1';

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesWishlist = !isWishlistView || wishlist.includes(product.id);
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSize = !selectedSize || product.variants.some((variant) => variant.status === 'active' && variant.size === selectedSize);
        const matchesColor = !selectedColor || product.variants.some((variant) => variant.status === 'active' && variant.color === selectedColor);
        const matchesPrice = product.variants.some(
          (variant) =>
            variant.status === 'active' &&
            variant.price >= priceRange[0] &&
            variant.price <= priceRange[1],
        );

        return matchesWishlist && matchesSearch && matchesCategory && matchesSize && matchesColor && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return Number(new Date(b.createdAt ?? 0)) - Number(new Date(a.createdAt ?? 0));
        if (sortBy === 'featured') return Number(b.isFeatured) - Number(a.isFeatured);
        return 0;
      });
  }, [isWishlistView, priceRange, products, searchQuery, selectedCategory, selectedColor, selectedSize, sortBy, wishlist]);

  const handleAddToCart = (product: Product) => {
    const variant = getDefaultVariant(product);
    if (!variant) {
      toast.error('This product is currently unavailable');
      return;
    }

    addToCart(buildCartItem(product, variant));
    toast.success('Added to cart');
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
    if (!wishlist.includes(productId)) {
      toast.success('Added to wishlist');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSize(null);
    setSelectedColor(null);
    setPriceRange(derivedPriceRange);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete('q');
      nextParams.delete('wishlist');
      nextParams.delete('focus');
      return nextParams;
    });
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={`cat-${category}`} checked={selectedCategory === category} onCheckedChange={() => setSelectedCategory(category)} />
              <Label htmlFor={`cat-${category}`} className="cursor-pointer text-sm font-medium">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest">Price Range</h3>
          <span className="text-xs font-mono text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span>
        </div>
        <Slider
          min={derivedPriceRange[0]}
          max={Math.max(derivedPriceRange[1], derivedPriceRange[0] + 1)}
          step={1}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="py-4"
        />
      </div>

      {sizes.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-lg min-w-[40px] h-10"
                  onClick={() => setSelectedSize((current) => (current === size ? null : size))}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {colors.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">Colors</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`group relative flex flex-col items-center gap-1 ${selectedColor === color ? 'scale-110' : ''}`}
                  title={color}
                  onClick={() => setSelectedColor((current) => (current === color ? null : color))}
                >
                  <div className="h-6 w-6 rounded-full border border-border bg-secondary" />
                  <span className="text-[10px] text-muted-foreground">{color}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title={isWishlistView ? 'Your Wishlist | theDMAshop' : 'Shop Premium Clothing | theDMAshop'}
        description={isWishlistView
          ? 'Review saved favorites and return to premium wardrobe essentials you want to shop next.'
          : 'Browse premium clothing, elevated basics, outerwear, and modern essentials from theDMAshop.'}
        canonicalPath="/shop"
        keywords={['shop clothing online', 'premium apparel', 'minimal fashion', 'wardrobe essentials', 'thedmashop products']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              name: isWishlistView ? 'Your Wishlist' : 'Shop All',
              description: isWishlistView
                ? 'Saved products and favorites from theDMAshop.'
                : 'Browse theDMAshop live catalog of premium fashion products.',
            },
            buildBreadcrumbList([
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
            ]),
          ],
        }}
      />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="space-y-4 mb-12">
          <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
            {isWishlistView ? 'Wishlist' : 'Live catalog'}
          </Badge>
          <h1 className="text-5xl font-heading font-bold tracking-tighter">
            {isWishlistView ? 'Your Wishlist' : 'Shop All'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {isWishlistView
              ? 'Browse the items you have saved and move them into your cart whenever you are ready.'
              : 'Browse the live catalog synced from Supabase. Filters, pricing, and availability all reflect active product variants.'}
          </p>
        </div>

        {productsLoading ? (
          <div className="rounded-3xl border border-border/50 bg-secondary/10 p-10 text-center text-muted-foreground">
            Loading products...
          </div>
        ) : productsError ? (
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-10 text-center space-y-3">
            <h2 className="text-2xl font-heading font-bold">Catalog unavailable</h2>
            <p className="text-muted-foreground">{productsError}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="hidden lg:block w-64 shrink-0">
              <FilterSidebar />
            </aside>

            <div className="flex-grow space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-secondary/20 p-4 rounded-2xl border border-border/50">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="shop-search-input"
                    placeholder="Search products..."
                    className="pl-10 rounded-full bg-background border-none premium-shadow"
                    value={searchQuery}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setSearchQuery(nextValue);
                      setSearchParams((currentParams) => {
                        const nextParams = new URLSearchParams(currentParams);
                        if (nextValue.trim()) {
                          nextParams.set('q', nextValue);
                        } else {
                          nextParams.delete('q');
                        }
                        return nextParams;
                      }, { replace: true });
                    }}
                  />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden rounded-full gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <SheetHeader className="mb-8">
                        <SheetTitle className="text-2xl font-heading font-bold">Filters</SheetTitle>
                        <SheetDescription>Refine your live catalog results</SheetDescription>
                      </SheetHeader>
                      <FilterSidebar />
                    </SheetContent>
                  </Sheet>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full gap-2">
                          <ArrowUpDown className="h-4 w-4" />
                          Sort
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-2">
                        <DropdownMenuItem onClick={() => setSortBy('featured')} className="rounded-lg">Featured</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('newest')} className="rounded-lg">Newest</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('price-low')} className="rounded-lg">Price: Low to High</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('price-high')} className="rounded-lg">Price: High to Low</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="hidden sm:flex items-center bg-background rounded-full p-1 border border-border">
                      <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="rounded-full h-8 w-8" onClick={() => setViewMode('grid')}>
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="rounded-full h-8 w-8" onClick={() => setViewMode('list')}>
                        <StretchHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {filteredProducts.length > 0 ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={`$${product.price.toFixed(2)}`}
                        category={product.category}
                        image={product.image}
                        isNew={product.isNew}
                        onAddToCart={() => handleAddToCart(product)}
                        onToggleWishlist={() => handleToggleWishlist(product.id)}
                        isWishlisted={wishlist.includes(product.id)}
                        onClick={() => navigate(`/products/${product.slug}`)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-secondary/10 rounded-3xl border-2 border-dashed border-border"
                  >
                    <div className="space-y-2">
                      <h3 className="text-2xl font-heading font-bold">No products match these filters</h3>
                      <p className="text-muted-foreground max-w-xs">
                        {isWishlistView
                          ? 'Your wishlist is empty or your saved items do not match the current filters yet.'
                          : 'Try widening the price range or clearing the category, size, and color filters.'}
                      </p>
                    </div>
                    <Button variant="outline" className="rounded-full px-8" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredProducts.length > 0 && (
                <div className="flex flex-col items-center gap-4 pt-12">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
