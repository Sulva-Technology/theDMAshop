import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export function FeaturedProducts() {
  const { products, addToCart, wishlist, toggleWishlist, setCurrentPage, setSelectedProductId } = useStore();
  
  // Just take the first two products for featured
  const featuredProducts = products.slice(0, 2);

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

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary block truncate">Curated Selection</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">Featured Pieces</h2>
        </div>
        <Button variant="link" className="group text-base sm:text-lg px-0 sm:px-4" onClick={() => setCurrentPage('shop')}>
          View All Products 
          <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform shrink-0" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredProducts.map((product) => (
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
        {/* Placeholders to fill the grid for visual balance */}
        <div className="hidden lg:block aspect-[4/5] rounded-3xl bg-secondary/20 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground italic p-8 text-center">
          More arrivals coming soon
        </div>
        <div className="hidden lg:block aspect-[4/5] rounded-3xl bg-secondary/20 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground italic p-8 text-center">
          More arrivals coming soon
        </div>
      </div>
    </section>
  );
}
