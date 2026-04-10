import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { BrandStory } from '@/components/home/BrandStory';
import { Policies } from '@/components/home/Policies';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <FeaturedProducts />
        </motion.div>

        <Categories />
        
        <BrandStory />
        
        <Policies />

        {/* Newsletter is integrated in Footer, but we can add a standalone section if needed */}
        {/* For this design, we'll keep it in the footer for a cleaner end-of-page flow */}
      </main>

      <Footer />
    </div>
  );
}
