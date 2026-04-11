import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { buildCartItem, getDefaultVariant } from '@/lib/product-helpers';
import type { Product } from '@/lib/types';

export function FeaturedProducts() {
  const { products, addToCart, wishlist, toggleWishlist, setCurrentPage, setSelectedProductId } = useStore();
  
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);

  const handleAddToCart = (product: Product) => {
    const variant = getDefaultVariant(product);
    if (!variant) {
      toast.error('This product is currently unavailable');
      return;
    }

    addToCart(buildCartItem(product, variant));
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

      {featuredProducts.length === 0 ? (
        <div className="rounded-3xl border border-border/50 bg-secondary/10 p-10 text-center text-muted-foreground">
          Mark products as featured in the admin catalog to populate this section.
        </div>
      ) : (
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
        </div>
      )}
    </section>
  );
}
