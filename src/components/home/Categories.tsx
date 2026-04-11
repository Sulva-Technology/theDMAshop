import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getAvailableCategories, getProductPrimaryImage } from '@/lib/product-helpers';

export function Categories() {
  const { products, setCurrentPage } = useStore();
  const categories = getAvailableCategories(products)
    .map((category, index) => {
      const firstProduct = products.find((product) => product.category === category);
      return {
        title: category,
        image: firstProduct ? getProductPrimaryImage(firstProduct) : '',
        size: index < 2 ? 'large' : 'small',
      };
    })
    .slice(0, 4);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="space-y-4 mb-12">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary block truncate">Explore</span>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            onClick={() => setCurrentPage('shop')}
            className={`relative overflow-hidden rounded-3xl group cursor-pointer aspect-[3/4] ${
              cat.size === 'large' ? 'lg:col-span-2 lg:aspect-[16/9]' : ''
            }`}
          >
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white truncate">{cat.title}</h3>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all duration-300 shrink-0">
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
