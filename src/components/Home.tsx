import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { BrandStory } from '@/components/home/BrandStory';
import { Policies } from '@/components/home/Policies';
import { Seo } from '@/components/Seo';
import { StorefrontPreloader } from '@/components/ui/StorefrontPreloader';
import { motion } from 'motion/react';
import { useStore } from '@/lib/store';
import { buildBreadcrumbList } from '@/lib/seo';

export default function Home() {
  const { productsLoading, productsError, contentLoading, contentError, cmsContent } = useStore();

  const homepageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://thedmashop.com/#organization',
        name: 'theDMAshop',
        url: 'https://thedmashop.com/',
        email: cmsContent.contactUs.email,
        telephone: cmsContent.contactUs.phone,
        sameAs: cmsContent.footer.socialLinks.map((link) => link.url).filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': 'https://thedmashop.com/#website',
        name: 'theDMAshop',
        url: 'https://thedmashop.com/',
        description: cmsContent.seo.description,
      },
      buildBreadcrumbList([{ name: 'Home', path: '/' }]),
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={cmsContent.seo.title || 'theDMAshop | Premium Minimal Essentials'}
        description={cmsContent.seo.description || 'Shop premium minimalist clothing and elevated everyday essentials at theDMAshop.'}
        image={cmsContent.hero.image}
        canonicalPath="/"
        keywords={['theDMAshop', 'premium fashion', 'minimal wardrobe', 'modern essentials', 'online clothing store']}
        jsonLd={homepageSchema}
      />
      <Navbar />
      
      <main className="flex-grow">
        {productsLoading || contentLoading ? (
          <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
            <StorefrontPreloader
              title="Setting the scene"
              message="Pulling the latest campaign content, featured products, and navigation details."
            />
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
