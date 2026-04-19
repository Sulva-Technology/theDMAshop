import React from 'react';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbList } from '@/lib/seo';

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  path?: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
};

export default function InfoPage({ eyebrow, title, intro, path = '/', sections }: InfoPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Seo
        title={`${title} | theDMAshop`}
        description={intro}
        canonicalPath={path}
        keywords={[title, 'theDMAshop', eyebrow.toLowerCase()]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebPage',
              name: title,
              description: intro,
            },
            buildBreadcrumbList([
              { name: 'Home', path: '/' },
              { name: title, path },
            ]),
          ],
        }}
      />
      <Navbar />
      <main className="flex-1">
        <section className="px-6 pt-24 pb-20 md:pt-32">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
              <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter">{title}</h1>
              <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">{intro}</p>
            </div>

            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.heading} className="rounded-3xl border border-border/50 bg-secondary/10 p-8 md:p-10">
                  <h2 className="text-2xl font-heading font-bold">{section.heading}</h2>
                  <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
                    {section.body.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
