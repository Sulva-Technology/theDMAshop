import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useStore } from '@/lib/store';
import { buildBreadcrumbList } from '@/lib/seo';
import { toast } from 'sonner';

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { cmsContent, submitContact, setCurrentPage } = useStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContact({
        firstName,
        lastName,
        email,
        orderNumber: orderNumber || undefined,
        message,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setOrderNumber('');
      setMessage('');
      toast.success('Your message has been sent.');
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to send your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Seo
        title="Contact theDMAshop | Customer Support"
        description="Contact theDMAshop for order help, shipping questions, sizing advice, and customer support."
        canonicalPath="/contact"
        keywords={['contact theDMAshop', 'customer support', 'fashion support', 'order help']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'ContactPage',
              name: 'Contact theDMAshop',
              description: 'Customer support and contact options for theDMAshop.',
            },
            {
              '@type': 'Organization',
              name: 'theDMAshop',
              email: cmsContent.contactUs.email,
              telephone: cmsContent.contactUs.phone,
            },
            buildBreadcrumbList([
              { name: 'Home', path: '/' },
              { name: 'Contact', path: '/contact' },
            ]),
          ],
        }}
      />
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto space-y-4"
            >
              <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter">
                Get in touch
              </h1>
              <p className="text-lg text-muted-foreground">
                Whether you have a question about an order, sizing, or just want to say hello, 
                our team is here to help.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              
              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-secondary/10 p-8 md:p-12 rounded-3xl border border-border/50"
              >
                {isSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <Send className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-heading font-bold">Message Sent!</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Thank you for reaching out. Our support team will get back to you within 24 hours.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-full mt-4"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Send us a message</h2>
                      <p className="text-sm text-muted-foreground">We typically reply within 24 hours.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required className="h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required className="h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required className="h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="orderNumber">Order Number (Optional)</Label>
                      <Input id="orderNumber" className="h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary" placeholder="#DMA-12345" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea 
                        id="message" 
                        required 
                        className="w-full min-h-[150px] p-4 rounded-xl bg-background border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
                        placeholder="How can we help you today?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-xl text-lg font-bold premium-shadow-hover gap-2"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      {!isSubmitting && <Send className="h-5 w-5" />}
                    </Button>
                  </form>
                )}
              </motion.div>

              {/* Contact Info & FAQ */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-12"
              >
                {/* Direct Contact Methods */}
                <div className="space-y-8">
                  <h3 className="text-xl font-heading font-bold">Other ways to connect</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-secondary/5 border border-border/50 flex flex-col gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">Email Support</p>
                        <a href={`mailto:${cmsContent.contactUs.email}`} className="text-muted-foreground hover:text-primary transition-colors">{cmsContent.contactUs.email}</a>
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-secondary/5 border border-border/50 flex flex-col gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">Phone Support</p>
                        <a href={`tel:${cmsContent.contactUs.phone.replace(/[^0-9+]/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors">{cmsContent.contactUs.phone}</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-secondary/10 border border-border/50">
                    <Clock className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
                    <div>
                      <p className="font-bold mb-1">Support Hours</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Monday - Friday: 9am - 6pm EST<br />
                        Saturday - Sunday: 10am - 4pm EST
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Snippet */}
                <div className="space-y-6 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-heading font-bold">Frequently Asked Questions</h3>
                    <Button variant="link" className="text-primary p-0 h-auto font-bold" onClick={() => setCurrentPage('/shipping-policy')}>
                      View all <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-border/50">
                      <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                        What is your return policy?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        We offer free returns within 30 days of delivery for all unworn, unwashed items with original tags attached.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-border/50">
                      <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                        How long does shipping take?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        Standard shipping typically takes 3-5 business days. Express shipping is available at checkout for 1-2 business day delivery.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-border/50">
                      <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                        Do you ship internationally?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        Yes, we ship to over 50 countries worldwide. International shipping rates and times vary by location and will be calculated at checkout.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

              </motion.div>
            </div>
          </div>
        </section>

        {/* Optional Map / Location */}
        <section className="py-12 px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="relative h-[400px] rounded-3xl overflow-hidden bg-secondary/20 border border-border/50 flex items-center justify-center group">
              {/* Placeholder for actual map integration */}
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map-placeholder/1200/400')] opacity-50 mix-blend-luminosity group-hover:opacity-70 transition-opacity duration-700 object-cover"></div>
              <div className="relative z-10 bg-background/90 backdrop-blur-md p-8 rounded-2xl premium-shadow max-w-sm text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Headquarters</h4>
                  <p className="text-muted-foreground mt-2 whitespace-pre-line">
                    {cmsContent.contactUs.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
