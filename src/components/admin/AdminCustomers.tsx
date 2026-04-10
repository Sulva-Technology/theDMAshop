import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail,
  MapPin,
  ShoppingBag,
  UserPlus,
  Star,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import { useStore } from '@/lib/store';

export default function AdminCustomers() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const { customers } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastActive');

  const filteredCustomers = customers.filter(c => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'totalSpent') return b.spent - a.spent;
    if (sortBy === 'orderCount') return b.orders - a.orders;
    return 0; // Default to lastActive (mocked as string so we don't sort it easily, just keep original order)
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">View customer profiles, segments, and order history from live account data.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full bg-background border-border/50">
            Export
          </Button>
          <Button className="rounded-full font-bold premium-shadow-sm gap-2" disabled>
            <UserPlus className="h-4 w-4" />
            Customers come from signups
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-background p-4 rounded-2xl border border-border/50 premium-shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers by name or email..." 
            className="pl-9 bg-secondary/10 border-none rounded-xl h-10 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-10 gap-2 border-border/50">
            <Filter className="h-4 w-4" />
            Segment
          </Button>
          <select 
            className="h-10 px-3 rounded-xl bg-background border border-border/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="lastActive">Sort by: Last Active</option>
            <option value="totalSpent">Sort by: Total Spent</option>
            <option value="orderCount">Sort by: Order Count</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4 font-medium w-12">
                  <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                </th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCustomers.map((customer, i) => (
                <tr key={i} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-[200px]">{customer.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{customer.location}</td>
                  <td className="px-6 py-4 font-medium">{customer.orders}</td>
                  <td className="px-6 py-4 font-medium">${customer.spent.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`border-none ${
                      customer.status === 'VIP' ? 'bg-purple-500/10 text-purple-600' : 
                      customer.status === 'New' ? 'bg-blue-500/10 text-blue-600' : 
                      customer.status === 'Guest' ? 'bg-secondary text-muted-foreground' :
                      'bg-green-500/10 text-green-600'
                    }`}>
                      {customer.status === 'VIP' && <Star className="h-3 w-3 mr-1 inline" />}
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedCustomer(customer)}>
                          View Profile
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l-0 sm:border-l border-border/50 p-0">
                        {selectedCustomer && (
                          <div className="flex flex-col h-full">
                            <SheetHeader className="p-8 border-b border-border/50 bg-secondary/10 text-center flex flex-col items-center">
                              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-4xl mb-4 premium-shadow-sm">
                                {selectedCustomer.name.charAt(0)}
                              </div>
                              <SheetTitle className="text-2xl font-heading font-bold">{selectedCustomer.name}</SheetTitle>
                              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                <Mail className="h-4 w-4" /> {selectedCustomer.email}
                              </p>
                              <div className="mt-4 flex gap-2">
                                <Badge variant="secondary" className="rounded-full">{selectedCustomer.status}</Badge>
                                <Badge variant="outline" className="rounded-full border-border/50">Since 2024</Badge>
                              </div>
                            </SheetHeader>
                            
                            <div className="p-6 space-y-8 flex-grow">
                              {/* Lifetime Value */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-secondary/10 border border-border/50 text-center">
                                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Spent</p>
                                  <p className="text-2xl font-bold text-primary">${selectedCustomer.spent.toFixed(2)}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/10 border border-border/50 text-center">
                                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Orders</p>
                                  <p className="text-2xl font-bold text-primary">{selectedCustomer.orders}</p>
                                </div>
                              </div>

                              <Separator />

                              {/* Contact & Location */}
                              <div className="space-y-4">
                                <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Details</h3>
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
                              </div>

                              <Separator />

                              {/* Notes */}
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Customer Notes</h3>
                                  <Button variant="link" className="text-primary h-auto p-0 text-xs">Edit</Button>
                                </div>
                                <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-sm text-muted-foreground">
                                  {selectedCustomer.status === 'VIP' 
                                    ? "High-value customer. Prefers expedited shipping. Send handwritten thank you note with next order."
                                    : "No notes added yet."}
                                </div>
                              </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="p-6 border-t border-border/50 bg-background sticky bottom-0 space-y-3">
                              <Button className="w-full rounded-xl h-12 font-bold premium-shadow-hover gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Create Order for Customer
                              </Button>
                              <Button variant="outline" className="w-full rounded-xl h-12 border-border/50">
                                Reset Password
                              </Button>
                            </div>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground bg-secondary/5">
          <span>Showing 1-{filteredCustomers.length} of {customers.length} customers</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
