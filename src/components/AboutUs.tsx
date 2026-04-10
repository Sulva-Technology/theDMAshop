import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Leaf, Heart, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AboutUs() {
  const { setCurrentPage, cmsContent } = useStore();
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter leading-tight mb-6">
                {cmsContent.aboutUs.title.split(' ').slice(0, -1).join(' ')} <br />
                <span className="text-muted-foreground">{cmsContent.aboutUs.title.split(' ').slice(-1)}.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {cmsContent.aboutUs.content}
              </p>
            </motion.div>
          </div>
          {/* Abstract Background Element */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10"></div>
        </section>

        {/* Brand Story (Editorial Layout) */}
        <section className="py-24 bg-secondary/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden premium-shadow"
              >
                <img 
                  src={cmsContent.aboutUs.image} 
                  alt="Brand Story" 
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
                  Our Story
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    It started with a frustration we all share: the gap between "fast fashion" 
                    and "luxury." We wanted clothes that felt incredible, lasted for years, 
                    and didn't require a second mortgage to afford.
                  </p>
                  <p>
theDMAshop was born from the desire to bridge that gap. We spent years
                    sourcing the finest fabrics, refining our fits, and partnering with ethical 
                    manufacturers who share our vision.
                  </p>
                  <p>
                    Today, we're proud to offer a collection of modern essentials that empower 
                    you to look and feel your best, every single day. No compromises.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-4">
                What Drives Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Our core values shape every decision we make, from the drawing board to your doorstep.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Sparkles className="h-6 w-6 text-primary" />,
                  title: "Uncompromising Quality",
                  description: "We obsess over every stitch, seam, and fabric choice to ensure our garments stand the test of time."
                },
                {
                  icon: <Leaf className="h-6 w-6 text-primary" />,
                  title: "Conscious Craft",
                  description: "We are committed to sustainable practices and ethical manufacturing, respecting both people and the planet."
                },
                {
                  icon: <Heart className="h-6 w-6 text-primary" />,
                  title: "Radical Accessibility",
                  description: "Premium shouldn't mean exclusive. We price our products fairly, making elevated style accessible to more people."
                }
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-3xl bg-secondary/10 border border-border/50 space-y-4 hover:bg-secondary/20 transition-colors"
                >
                  <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center premium-shadow-sm">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality / Design Philosophy */}
        <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
                  Designed for life. <br /> Built to last.
                </h2>
                <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-md">
                  Our design philosophy is rooted in minimalism and functionality. 
                  We strip away the unnecessary, focusing on clean lines, superior 
                  materials, and fits that move with you. Every piece is designed 
                  to be a foundational element of your wardrobe.
                </p>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="rounded-full h-12 px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors"
                    onClick={() => setCurrentPage('shop')}
                  >
                    Explore the Collection
                  </Button>
                </div>
              </div>
              <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/fabric-detail/800/1000" 
                  alt="Fabric Detail" 
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl"></div>
          </div>
        </section>

        {/* Trust & Reassurance */}
        <section className="py-24 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-12 rounded-3xl bg-secondary/10 border border-border/50">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center premium-shadow-sm shrink-0">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">The DMA Guarantee</h3>
                  <p className="text-muted-foreground">
                    Try our pieces risk-free. If you don't love it, returns are free within 30 days.
                  </p>
                </div>
              </div>
              <Button 
                className="rounded-full h-14 px-8 text-lg font-bold premium-shadow-hover gap-2 shrink-0"
                onClick={() => setCurrentPage('shop')}
              >
                Shop Now <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
