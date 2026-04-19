import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { POLICY_ROUTES } from '@/lib/policies';

const SOCIAL_ICONS = {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
} as const;

const LEGAL_LINKS = [
  { label: 'Privacy Policy', url: POLICY_ROUTES.privacy },
  { label: 'Terms of Service', url: POLICY_ROUTES.terms },
  { label: 'Cookie Settings', url: POLICY_ROUTES.cookies },
];

const SOCIAL_FALLBACKS: Record<string, string> = {
  Instagram: 'https://instagram.com',
  Twitter: 'https://x.com',
  Facebook: 'https://facebook.com',
  Youtube: 'https://youtube.com',
};

const LINK_FALLBACKS: Record<string, string> = {
  'New Arrivals': '/shop',
  'Best Sellers': '/shop',
  Essentials: '/shop',
  Outerwear: '/shop',
  Accessories: '/shop',
  'Shipping Policy': POLICY_ROUTES.shipping,
  'Returns & Exchanges': POLICY_ROUTES.refund,
  'Track Your Order': '/account/orders',
  'Size Guide': '/size-guide',
  'Contact Us': '/contact',
};

export function Footer() {
  const { setCurrentPage, cmsContent, submitNewsletter } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolveLink = (label: string, url: string, type: 'internal' | 'social') => {
    const normalizedUrl = url?.trim();
    if (normalizedUrl && normalizedUrl !== '#') {
      return normalizedUrl;
    }

    if (type === 'social') {
      return SOCIAL_FALLBACKS[label] ?? '';
    }

    return LINK_FALLBACKS[label] ?? '/';
  };

  const handleNavigate = (url: string) => {
    if (!url) {
      return;
    }

    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    setCurrentPage(url);
  };

  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await submitNewsletter(newsletterEmail);
      setNewsletterEmail('');
      toast.success('You are subscribed to the newsletter.');
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to subscribe right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-secondary/30 pt-24 pb-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="space-y-6">
            <button onClick={() => setCurrentPage('home')} className="text-3xl font-heading font-bold text-primary tracking-tighter">theDMAshop</button>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              {cmsContent.footer.description}
            </p>
            <div className="flex gap-4">
              {cmsContent.footer.socialLinks.map((link, index) => {
                const Icon = SOCIAL_ICONS[link.platform as keyof typeof SOCIAL_ICONS];
                const socialUrl = resolveLink(link.platform, link.url, 'social');
                if (!Icon || !socialUrl) return null;

                return (
                  <a
                    key={`${link.platform}-${index}`}
                    href={socialUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.platform}
                    className="p-2 bg-background rounded-full hover:text-primary transition-colors premium-shadow"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Shop</h4>
            <ul className="space-y-4 text-muted-foreground">
              {cmsContent.footer.shopLinks.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <button onClick={() => handleNavigate(resolveLink(link.label, link.url, 'internal'))} className="hover:text-primary transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Support</h4>
            <ul className="space-y-4 text-muted-foreground">
              {cmsContent.footer.supportLinks.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <button onClick={() => handleNavigate(resolveLink(link.label, link.url, 'internal'))} className="hover:text-primary transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
              <Input
                type="email"
                required
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="Enter your email"
                className="rounded-full bg-background border-none px-6 py-6 premium-shadow focus-visible:ring-primary"
              />
              <Button type="submit" disabled={isSubmitting} className="w-full rounded-full py-6 font-semibold">
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border/50 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium text-center md:text-left">
          <p className="truncate w-full md:w-auto">{cmsContent.footer.copyright}</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8">
            {LEGAL_LINKS.map((link) => (
              <button key={link.label} onClick={() => handleNavigate(link.url)} className="hover:text-primary transition-colors">
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
