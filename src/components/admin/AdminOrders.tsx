import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin
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
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useStore, Order } from '@/lib/store';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { orders, updateOrderStatus } = useStore();

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order status updated to ${newStatus}`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredOrders = orders.filter(o => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return o.id.toLowerCase().includes(query) || 
             o.customerName.toLowerCase().includes(query) || 
             o.customerEmail.toLowerCase().includes(query);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'total') return b.total - a.total;
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // Default to newest
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Track, manage, and fulfill customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full bg-background border-border/50">
            Export CSV
          </Button>
          <Button className="rounded-full font-bold premium-shadow-sm">
            Create Order
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-background p-4 rounded-2xl border border-border/50 premium-shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by order ID, customer, or email..." 
            className="pl-9 bg-secondary/10 border-none rounded-xl h-10 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-10 gap-2 border-border/50">
            <Filter className="h-4 w-4" />
            Status
          </Button>
          <select 
            className="h-10 px-3 rounded-xl bg-background border border-border/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort by: Date (Newest first)</option>
            <option value="oldest">Sort by: Date (Oldest first)</option>
            <option value="total">Sort by: Total amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4 font-medium w-12">
                  <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                </th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground cursor-pointer hover:text-primary transition-colors">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium truncate max-w-[150px]">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`border-none bg-green-500/10 text-green-600`}>
                      Paid
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`border-none ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-600' : 
                      order.status === 'shipped' ? 'bg-purple-500/10 text-purple-600' : 
                      order.status === 'processing' ? 'bg-blue-500/10 text-blue-600' :
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-600' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l-0 sm:border-l border-border/50 p-0">
                        {selectedOrder && (
                          <div className="flex flex-col h-full">
                            <SheetHeader className="p-6 border-b border-border/50 bg-secondary/10">
                              <div className="flex justify-between items-start">
                                <div>
                                  <SheetTitle className="text-2xl font-heading font-bold">{selectedOrder.orderNumber}</SheetTitle>
                                  <p className="text-sm text-muted-foreground mt-1">{new Date(selectedOrder.date).toLocaleString()}</p>
                                </div>
                                <Badge className="rounded-full bg-green-500/10 text-green-600 border-none">Paid</Badge>
                              </div>
                            </SheetHeader>
                            
                            <div className="p-6 space-y-8 flex-grow">
                              {/* Customer Snapshot */}
                              <div className="space-y-4">
                                <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Customer</h3>
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {selectedOrder.customerName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold">{selectedOrder.customerName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              {/* Shipping Info */}
                              <div className="space-y-4">
                                <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Shipping Address</h3>
                                <div className="flex items-start gap-3 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                  <p className="leading-relaxed">
                                    {selectedOrder.customerName}<br />
                                    123 Fashion Avenue, Apt 4B<br />
                                    New York, NY 10001<br />
                                    United States
                                  </p>
                                </div>
                              </div>

                              <Separator />

                              {/* Order Items */}
                              <div className="space-y-4">
                                <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Items ({selectedOrder.items.length})</h3>
                                <div className="space-y-4">
                                  {selectedOrder.items.length > 0 ? selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                      <div className="h-16 w-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div className="flex-grow min-w-0">
                                        <p className="font-bold text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.color} / {item.size}</p>
                                        <div className="flex justify-between items-center mt-2">
                                          <span className="text-sm shrink-0">{item.quantity} x ${item.price.toFixed(2)}</span>
                                          <span className="font-medium shrink-0">${(item.quantity * item.price).toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )) : (
                                    <p className="text-sm text-muted-foreground">No items found.</p>
                                  )}
                                </div>
                              </div>

                              <Separator />

                              {/* Summary */}
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Subtotal</span>
                                  <span>${(selectedOrder.total / 1.08).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Shipping (Standard)</span>
                                  <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Tax</span>
                                  <span>${(selectedOrder.total - (selectedOrder.total / 1.08)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50 mt-2">
                                  <span>Total</span>
                                  <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Quick Actions Footer */}
                            <div className="p-6 border-t border-border/50 bg-background sticky bottom-0 space-y-3">
                              {selectedOrder.status === 'processing' && (
                                <Button 
                                  className="w-full rounded-xl h-12 font-bold premium-shadow-hover gap-2"
                                  onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                                >
                                  <Truck className="h-4 w-4" />
                                  Mark as Shipped
                                </Button>
                              )}
                              {selectedOrder.status === 'shipped' && (
                                <Button 
                                  className="w-full rounded-xl h-12 font-bold premium-shadow-hover gap-2 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Mark as Delivered
                                </Button>
                              )}
                              {selectedOrder.status !== 'cancelled' && (
                                <Button 
                                  variant="outline" 
                                  className="w-full rounded-xl h-12 text-destructive hover:text-destructive hover:bg-destructive/10 border-border/50"
                                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                                >
                                  Cancel Order
                                </Button>
                              )}
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
          <span>Showing 1-{filteredOrders.length} of {orders.length} orders</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
