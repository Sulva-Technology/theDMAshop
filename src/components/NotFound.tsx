import React from 'react';
import { ArrowLeft, Compass, ShieldAlert } from 'lucide-react';

import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { absoluteUrl } from '@/lib/seo';
import { useStore } from '@/lib/store';

export default function NotFound() {
  const { setCurrentPage } = useStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Page Not Found | theDMAshop"
        description="The page you requested could not be found. Continue shopping or return to the main store."
        canonicalPath="/404"
        noindex
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Page Not Found',
          url: absoluteUrl('/404'),
        }}
      />

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.35),transparent_30%)]" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-[2rem] border border-border/60 bg-background/90 p-8 shadow-2xl backdrop-blur md:p-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-secondary/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <ShieldAlert className="h-4 w-4" />
              404 Error
            </div>

            <div className="space-y-4">
              <p className="text-6xl font-heading font-bold tracking-tighter text-primary/80 md:text-8xl">Lost?</p>
              <h1 className="text-3xl font-heading font-bold tracking-tight md:text-5xl">
                This page stepped out of the wardrobe.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                The link may be broken, the page may have moved, or the URL might be off. You can head back home, keep shopping, or jump straight to account access.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="rounded-full px-8" onClick={() => setCurrentPage('home')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back Home
              </Button>
              <Button variant="outline" className="rounded-full px-8" onClick={() => setCurrentPage('/shop')}>
                <Compass className="mr-2 h-4 w-4" />
                Browse Shop
              </Button>
              <Button variant="ghost" className="rounded-full px-8" onClick={() => setCurrentPage('/auth')}>
                Admin / Account Login
              </Button>
            </div>
          </div>

          <div className="grid min-w-[220px] gap-4 rounded-[1.5rem] border border-border/60 bg-secondary/20 p-6 text-sm text-muted-foreground">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Try this</p>
              <p className="mt-2">Use `/auth` for sign-in and `/admin` after login if you’re expecting the dashboard.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Common fixes</p>
              <p className="mt-2">Refresh the page after deployment and make sure your hosting rewrites route requests to the SPA entry.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
