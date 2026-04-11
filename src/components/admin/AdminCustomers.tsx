import React, { useState } from 'react';
import { Clock, Mail, MapPin, Search, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useStore } from '@/lib/store';

export default function AdminCustomers() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastActive');
  const { customers } = useStore();

  const filteredCustomers = customers
    .filter((customer) => {
      if (!searchQuery) {
        return true;
      }
      const query = searchQuery.toLowerCase();
      return customer.name.toLowerCase().includes(query) || customer.email.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      if (sortBy === 'totalSpent') return b.spent - a.spent;
      if (sortBy === 'orderCount') return b.orders - a.orders;
      return 0;
    });

  const selectedCustomer = filteredCustomers.find((customer) => customer.id === selectedCustomerId) ?? null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">Read-only customer summaries pulled from live profiles and order activity.</p>
        </div>
        <Button className="rounded-full font-bold" disabled>
          Customers come from signups
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-background p-4 rounded-2xl border border-border/50 premium-shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers by name or email..." className="pl-9 bg-secondary/10 border-none rounded-xl h-10" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
        </div>
        <select className="h-10 px-3 rounded-xl bg-background border border-border/50 text-sm" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="lastActive">Sort by: Last active</option>
          <option value="totalSpent">Sort by: Total spent</option>
          <option value="orderCount">Sort by: Order count</option>
        </select>
      </div>

      <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{customer.location}</td>
                  <td className="px-6 py-4 font-medium">{customer.orders}</td>
                  <td className="px-6 py-4 font-medium">${customer.spent.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="border-none">
                      {customer.status === 'VIP' ? <Star className="h-3 w-3 mr-1 inline" /> : null}
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" className="rounded-full" onClick={() => setSelectedCustomerId(customer.id)}>
                          View profile
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
                        {selectedCustomer && (
                          <div className="flex flex-col h-full">
                            <SheetHeader className="p-8 border-b border-border/50 bg-secondary/10 text-center flex flex-col items-center">
                              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-4xl mb-4">
                                {selectedCustomer.name.charAt(0)}
                              </div>
                              <SheetTitle className="text-2xl font-heading font-bold">{selectedCustomer.name}</SheetTitle>
                              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                <Mail className="h-4 w-4" /> {selectedCustomer.email}
                              </p>
                            </SheetHeader>

                            <div className="p-6 space-y-8">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-secondary/10 border border-border/50 text-center">
                                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total spent</p>
                                  <p className="text-2xl font-bold text-primary">${selectedCustomer.spent.toFixed(2)}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/10 border border-border/50 text-center">
                                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total orders</p>
                                  <p className="text-2xl font-bold text-primary">{selectedCustomer.orders}</p>
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedCustomer.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>Last active {selectedCustomer.lastActive}</span>
                                </div>
                              </div>

                              <Separator />

                              <div className="rounded-xl bg-secondary/10 p-4 text-sm text-muted-foreground">
                                Customer creation, edits, and password actions are managed through Supabase Auth. This view is intentionally read-only in production.
                              </div>
                            </div>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
