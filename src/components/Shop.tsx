import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  X, 
  ShoppingBag, 
  Heart, 
  LayoutGrid, 
  StretchHorizontal,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const CATEGORIES = ["All", "Essentials", "Outerwear", "Bottoms", "Accessories"];
const SIZES = ["S", "M", "L", "XL", "30", "32", "34"];
const COLORS = ["Navy", "White", "Black", "Camel", "Charcoal", "Beige", "Forest", "Gray"];

export default function Shop() {
  const { products, addToCart, wishlist, toggleWishlist, setCurrentPage, setSelectedProductId } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: `${product.id}-${product.colors[0]}-${product.sizes[0]}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.colors[0],
      size: product.sizes[0],
      quantity: 1
    });
    toast.success("Added to cart");
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
    if (!wishlist.includes(productId)) {
      toast.success("Added to wishlist");
    } else {
      toast.info("Removed from wishlist");
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${cat}`} 
                checked={selectedCategory === cat}
                onCheckedChange={() => setSelectedCategory(cat)}
              />
              <Label 
                htmlFor={`cat-${cat}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {cat}
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
          defaultValue={[0, 500]}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="py-4"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <Button 
              key={size} 
              variant="outline" 
              size="sm" 
              className="rounded-lg min-w-[40px] h-10 hover:border-primary hover:text-primary transition-colors"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(color => (
            <button 
              key={color}
              className="group relative flex flex-col items-center gap-1"
              title={color}
            >
              <div 
                className={`h-6 w-6 rounded-full border border-border group-hover:scale-110 transition-transform`}
                style={{ backgroundColor: color.toLowerCase() === 'navy' ? '#000080' : color.toLowerCase() }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        {/* Page Header */}
        <div className="space-y-4 mb-12">
          <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold">Collection 2026</Badge>
          <h1 className="text-5xl font-heading font-bold tracking-tighter">Shop All</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our curated selection of premium essentials. Meticulously designed for the modern individual who values quality and timeless style.
          </p>
        </div>

        {/* Promo Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-primary rounded-3xl p-6 sm:p-8 md:p-12 mb-16 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="space-y-4 text-center md:text-left">
              <Badge className="bg-white text-primary hover:bg-white/90 rounded-full px-4">Limited Offer</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white tracking-tight break-words">
                Get 20% off your first order
              </h2>
              <p className="text-white/70 max-w-md mx-auto md:mx-0">
            Join theDMAshop community today and elevate your wardrobe with our premium essentials.
              </p>
            </div>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-bold premium-shadow shrink-0">
              Claim Discount
            </Button>
          </div>
          {/* Abstract Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex-grow space-y-8">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-secondary/20 p-4 rounded-2xl border border-border/50">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 rounded-full bg-background border-none premium-shadow focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                {/* Mobile Filter Trigger */}
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
                      <SheetDescription>Refine your search results</SheetDescription>
                    </SheetHeader>
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort: {sortBy === 'featured' ? 'Featured' : sortBy === 'price-low' ? 'Price Low' : 'Price High'}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl p-2">
                      <DropdownMenuItem onClick={() => setSortBy('featured')} className="rounded-lg">Featured</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('price-low')} className="rounded-lg">Price: Low to High</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('price-high')} className="rounded-lg">Price: High to Low</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="hidden sm:flex items-center bg-background rounded-full p-1 border border-border">
                    <Button 
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                      size="icon" 
                      className="rounded-full h-8 w-8"
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                      size="icon" 
                      className="rounded-full h-8 w-8"
                      onClick={() => setViewMode('list')}
                    >
                      <StretchHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid gap-8 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}
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
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setCurrentPage('details');
                      }}
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
                  <div className="h-20 w-20 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-heading font-bold">No products found</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Try adjusting your filters or search query to find what you're looking for.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-full px-8"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setPriceRange([0, 500]);
                    }}
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex flex-col items-center gap-4 pt-12">
                <p className="text-sm text-muted-foreground">Showing {filteredProducts.length} of {products.length} products</p>
                <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(filteredProducts.length / products.length) * 100}%` }}
                  ></div>
                </div>
                <Button variant="outline" size="lg" className="rounded-full px-12 py-6 premium-shadow-hover mt-4">
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
