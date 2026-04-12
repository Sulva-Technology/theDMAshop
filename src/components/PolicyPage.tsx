import { Link, Navigate, useParams } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { POLICY_PAGES, type PolicySlug } from '@/lib/policies';

export default function PolicyPage() {
  const { slug } = useParams<{ slug: PolicySlug }>();
  const policy = slug ? POLICY_PAGES[slug] : null;

  if (!policy) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-16">
        <div className="rounded-3xl border border-border/50 bg-secondary/10 p-8 md:p-12 space-y-8">
          <div className="space-y-3">
            <Link to="/" className="text-sm text-primary hover:underline underline-offset-4">
              Back to home
            </Link>
            <h1 className="text-4xl font-heading font-bold tracking-tight">{policy.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{policy.description}</p>
          </div>
          <div className="space-y-6">
            {policy.sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h2 className="text-lg font-bold">{section.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
