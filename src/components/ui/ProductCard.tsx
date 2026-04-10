import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  key?: React.Key;
  id: string | number;
  name: string;
  price: string;
  category: string;
  image: string;
  isNew?: boolean;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  onClick?: () => void;
}

export function ProductCard({ id, name, price, category, image, isNew, onAddToCart, onToggleWishlist, isWishlisted, onClick }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary mb-4 premium-shadow-hover">
        <img 
          src={image} 
          alt={name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className={`rounded-full glass h-10 w-10 transition-opacity ${isWishlisted ? 'opacity-100 text-red-500' : 'opacity-0 group-hover:opacity-100'}`}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(); }}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full glass h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
        {isNew && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-white text-black hover:bg-white/90 rounded-full px-3 border-none font-medium">New Arrival</Badge>
          </div>
        )}
      </div>
      <div className="space-y-1 px-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-lg text-foreground group-hover:text-primary transition-colors truncate">{name}</h3>
          <p className="font-semibold text-primary whitespace-nowrap">{price}</p>
        </div>
        <p className="text-sm text-muted-foreground truncate">{category}</p>
        <div className="flex items-center gap-1 pt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-primary text-primary" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>
      </div>
    </motion.div>
  );
}
