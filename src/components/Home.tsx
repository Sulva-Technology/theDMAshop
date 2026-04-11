import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { BrandStory } from '@/components/home/BrandStory';
import { Policies } from '@/components/home/Policies';
import { motion } from 'motion/react';
import { useStore } from '@/lib/store';

export default function Home() {
  const { productsLoading, productsError, contentLoading, contentError } = useStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {productsLoading || contentLoading ? (
          <section className="max-w-5xl mx-auto px-6 py-24">
            <div className="rounded-3xl border border-border/50 bg-secondary/10 p-10 text-center text-muted-foreground">
              Loading storefront data...
            </div>
          </section>
        ) : contentError ? (
          <section className="max-w-5xl mx-auto px-6 py-24">
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-10 text-center space-y-4">
              <h1 className="text-3xl font-heading font-bold tracking-tight">Storefront setup required</h1>
              <p className="text-muted-foreground">{contentError}</p>
              <p className="text-sm text-muted-foreground">
                Seed the CMS content in Supabase, then refresh the app.
              </p>
            </div>
          </section>
        ) : (
          <>
            <Hero />
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <FeaturedProducts />
            </motion.div>

            {!productsError && <Categories />}
            
            <BrandStory />
            
            <Policies />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
