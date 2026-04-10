import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  Minus,
  Check,
  Info
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const PRODUCT_DATA = {
  id: "2",
  name: "Premium Wool Blend Overcoat",
  price: 280.00,
  rating: 4.9,
  reviewCount: 128,
  category: "Outerwear",
  summary: "A masterclass in minimalist tailoring. Crafted from a luxurious Italian wool blend, this overcoat offers a sharp silhouette and exceptional warmth for the modern professional.",
  description: "Our Premium Wool Blend Overcoat is the cornerstone of a sophisticated winter wardrobe. Designed with a focus on clean lines and structural integrity, it features a notched lapel, three-button closure, and a fully lined interior for maximum comfort. The fabric is a dense, high-performance wool blend that resists pilling and maintains its shape over time.",
  details: [
    "70% Virgin Wool, 30% Polyamide",
    "Tailored slim fit",
    "Notched lapel with decorative buttonhole",
    "Two exterior welt pockets, two interior chest pockets",
    "Single rear vent for ease of movement",
    "Dry clean only"
  ],
  images: [
    "https://picsum.photos/seed/fashion-2/1200/1500",
    "https://picsum.photos/seed/fashion-detail-1/1200/1500",
    "https://picsum.photos/seed/fashion-detail-2/1200/1500",
    "https://picsum.photos/seed/fashion-detail-3/1200/1500"
  ],
  colors: [
    { name: "Midnight Navy", hex: "#1B1B2F" },
    { name: "Charcoal", hex: "#363636" },
    { name: "Camel", hex: "#C19A6B" }
  ],
  sizes: ["S", "M", "L", "XL", "XXL"]
};

const RELATED_PRODUCTS = [
  {
    id: "1",
    name: "Premium Cotton Tee",
    price: 45.00,
    category: "Essentials",
    image: "https://picsum.photos/seed/fashion-1/800/1000",
    isNew: true
  },
  {
    id: "4",
    name: "Merino Wool Sweater",
    price: 120.00,
    category: "Essentials",
    image: "https://picsum.photos/seed/fashion-4/800/1000",
    isNew: false
  },
  {
    id: "3",
    name: "Structured Chino Pant",
    price: 85.00,
    category: "Bottoms",
    image: "https://picsum.photos/seed/fashion-3/800/1000",
    isNew: true
  }
];

export default function ProductDetails() {
  const { products, addToCart, wishlist, toggleWishlist, setCurrentPage, cmsContent, selectedProductId, setSelectedProductId } = useStore();
  
  // Find the selected product, fallback to the first product if not found
  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || { name: "Default", hex: "#000" });
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Reset state when product changes
  React.useEffect(() => {
    setSelectedImage(0);
    setSelectedColor(product?.colors?.[0] || { name: "Default", hex: "#000" });
    setSelectedSize("");
    setQuantity(1);
  }, [product?.id]);

  if (!product) return <div>Product not found</div>;

  const isWishlisted = wishlist.includes(product.id);
  
  // Get 3 random/first products from store for related products
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsAdding(true);
    // Simulate network request
    setTimeout(() => {
      addToCart({
        id: `${product.id}-${typeof selectedColor === 'string' ? selectedColor : selectedColor.name}-${selectedSize}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        color: typeof selectedColor === 'string' ? selectedColor : selectedColor.name,
        size: selectedSize,
        quantity
      });
      setIsAdding(false);
      toast.success("Added to cart");
    }, 500);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    if (!isWishlisted) {
      toast.success("Added to wishlist");
    } else {
      toast.info("Removed from wishlist");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary premium-shadow">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" onClick={prevImage} className="rounded-full glass">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button size="icon" variant="secondary" onClick={nextImage} className="rounded-full glass">
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      selectedImage === i ? 'w-8 bg-primary' : 'w-2 bg-primary/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold">
                    {product.category}
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tighter break-words">{product.name}</h1>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1 sm:justify-end mt-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-bold">4.9</span>
                    <span className="text-xs text-muted-foreground">(128 reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {product.summary || PRODUCT_DATA.summary}
              </p>
            </div>

            <Separator />

            {/* Color Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest">Color: <span className="text-muted-foreground font-medium">{typeof selectedColor === 'string' ? selectedColor : selectedColor.name}</span></h3>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => {
                  const colorName = typeof color === 'string' ? color : color.name;
                  const colorHex = typeof color === 'string' ? (color.toLowerCase() === 'navy' ? '#000080' : color.toLowerCase()) : color.hex;
                  return (
                  <button
                    key={colorName}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 w-10 rounded-full border-2 p-0.5 transition-all ${
                      (typeof selectedColor === 'string' ? selectedColor : selectedColor.name) === colorName ? 'border-primary scale-110' : 'border-transparent'
                    }`}
                  >
                    <div 
                      className="w-full h-full rounded-full border border-black/10" 
                      style={{ backgroundColor: colorHex }}
                    />
                  </button>
                )})}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest">Size: <span className="text-muted-foreground font-medium">{selectedSize || 'Select'}</span></h3>
                <button className="text-xs font-bold text-primary underline underline-offset-4">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl h-12 font-bold ${selectedSize === size ? 'premium-shadow' : ''}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap sm:flex-nowrap gap-4">
                <div className="flex items-center bg-secondary/30 rounded-full px-2 border border-border shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  className="flex-grow rounded-full h-14 text-base sm:text-lg font-bold premium-shadow-hover gap-2 w-full sm:w-auto"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <ShoppingCart className="h-5 w-5 shrink-0" />
                  <span className="truncate">{isAdding ? "Adding..." : "Add to Cart"}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-14 w-14 shrink-0 transition-colors ${isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 px-4 bg-secondary/10 rounded-3xl border border-border/50">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{cmsContent.policies[0].title}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{cmsContent.policies[1].title}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{cmsContent.policies[2].title}</span>
              </div>
            </div>

            {/* Accordion Details */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description" className="border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline">Description</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {product.description || PRODUCT_DATA.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="details" className="border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline">Details & Fit</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {(product.details || PRODUCT_DATA.details).map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-none">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2">
                  <p>{cmsContent.policies[0].content}</p>
                  <p>{cmsContent.policies[1].content}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="py-24 border-t border-border mt-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className="space-y-2">
              <h2 className="text-4xl font-heading font-bold tracking-tight">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-lg font-bold">4.9 out of 5</span>
                <span className="text-muted-foreground">Based on 128 reviews</span>
              </div>
            </div>
            <Button size="lg" className="rounded-full px-8">Write a Review</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="p-8 bg-secondary/10 rounded-3xl space-y-4 border border-border/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">2 weeks ago</span>
                </div>
                <h4 className="font-bold text-lg">"Exceptional Quality"</h4>
                <p className="text-muted-foreground leading-relaxed">
                  The fit is absolutely perfect and the wool quality is much higher than I expected for the price. It's become my go-to coat for both formal and casual outings.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {i === 1 ? 'JD' : 'AS'}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{i === 1 ? 'John D.' : 'Alice S.'}</p>
                    <p className="text-xs text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="rounded-full px-12">View All Reviews</Button>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-24 border-t border-border">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Discovery</span>
              <h2 className="text-4xl font-heading font-bold tracking-tight">Complete the Look</h2>
            </div>
            <Button variant="link" className="group text-lg" onClick={() => setCurrentPage('shop')}>
              View Collection 
              <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relProduct) => (
              <ProductCard 
                key={relProduct.id} 
                id={relProduct.id}
                name={relProduct.name}
                price={`$${relProduct.price.toFixed(2)}`}
                category={relProduct.category}
                image={relProduct.image}
                isNew={relProduct.isNew}
                onAddToCart={() => {
                  addToCart({
                    id: `${relProduct.id}-${relProduct.colors[0]}-${relProduct.sizes[0]}`,
                    productId: relProduct.id,
                    name: relProduct.name,
                    price: relProduct.price,
                    image: relProduct.image,
                    color: relProduct.colors[0],
                    size: relProduct.sizes[0],
                    quantity: 1
                  });
                  toast.success("Added to cart");
                }}
                onToggleWishlist={() => {
                  toggleWishlist(relProduct.id);
                  if (!wishlist.includes(relProduct.id)) {
                    toast.success("Added to wishlist");
                  } else {
                    toast.info("Removed from wishlist");
                  }
                }}
                isWishlisted={wishlist.includes(relProduct.id)}
                onClick={() => {
                  setSelectedProductId(relProduct.id);
                  setCurrentPage('details');
                }}
              />
            ))}
            <div className="hidden lg:block aspect-[4/5] rounded-3xl bg-secondary/20 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground italic p-8 text-center">
              New styles arriving weekly
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
