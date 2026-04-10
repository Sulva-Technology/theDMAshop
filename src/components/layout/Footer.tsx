import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { useStore } from '@/lib/store';

export function Footer() {
  const { setCurrentPage, cmsContent } = useStore();
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
                const Icon = link.platform === 'Instagram' ? Instagram :
                             link.platform === 'Twitter' ? Twitter :
                             link.platform === 'Facebook' ? Facebook :
                             link.platform === 'Youtube' ? Youtube : null;
                if (!Icon) return null;
                return (
                  <a key={index} href={link.url} className="p-2 bg-background rounded-full hover:text-primary transition-colors premium-shadow">
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
                <li key={index}><button onClick={() => setCurrentPage(link.url)} className="hover:text-primary transition-colors">{link.label}</button></li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Support</h4>
            <ul className="space-y-4 text-muted-foreground">
              {cmsContent.footer.supportLinks.map((link, index) => (
                <li key={index}>
                  {link.url.startsWith('#') || link.url.startsWith('http') ? (
                    <a href={link.url} className="hover:text-primary transition-colors">{link.label}</a>
                  ) : (
                    <button onClick={() => setCurrentPage(link.url)} className="hover:text-primary transition-colors">{link.label}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="space-y-3">
              <Input 
                placeholder="Enter your email" 
                className="rounded-full bg-background border-none px-6 py-6 premium-shadow focus-visible:ring-primary" 
              />
              <Button className="w-full rounded-full py-6 font-semibold">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border/50 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium text-center md:text-left">
          <p className="truncate w-full md:w-auto">{cmsContent.footer.copyright}</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
