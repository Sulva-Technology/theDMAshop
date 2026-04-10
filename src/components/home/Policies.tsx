import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';
import { useStore } from '@/lib/store';

export function Policies() {
  const { cmsContent } = useStore();
  
  const ICONS = [Truck, RotateCcw, ShieldCheck, CreditCard];

  return (
    <section className="py-24 border-y border-border bg-secondary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {cmsContent.policies.map((policy, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                <div className="h-16 w-16 rounded-2xl bg-background flex items-center justify-center premium-shadow group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2 px-2">
                  <h3 className="font-bold text-lg truncate">{policy.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                    {policy.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
