import React, { useMemo, useState } from 'react';
import { CheckCircle, Eye, Filter, MapPin, Search, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useStore, type Order } from '@/lib/store';

const NEXT_FULFILLMENT_STATUS: Record<Order['fulfillmentStatus'], Order['fulfillmentStatus'] | null> = {
  processing: 'shipped',
  shipped: 'delivered',
  delivered: null,
  cancelled: null,
};

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { orders, ordersLoading, ordersError, updateOrderStatus } = useStore();

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (!searchQuery) {
          return true;
        }

        const query = searchQuery.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'total') return b.total - a.total;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [orders, searchQuery, sortBy]);

  const syncSelectedOrder = (orderId: string, status: Order['fulfillmentStatus']) => {
    setSelectedOrder((current) => (current && current.id === orderId ? { ...current, fulfillmentStatus: status, status } : current));
  };

  const handleStatusAdvance = async (order: Order) => {
    const nextStatus = NEXT_FULFILLMENT_STATUS[order.fulfillmentStatus];
    if (!nextStatus) {
      return;
    }

    try {
      await updateOrderStatus(order.id, nextStatus);
      syncSelectedOrder(order.id, nextStatus);
      toast.success(`Order updated to ${nextStatus}`);
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to update order status');
    }
  };

  const handleCancel = async (order: Order) => {
    try {
      await updateOrderStatus(order.id, 'cancelled');
      syncSelectedOrder(order.id, 'cancelled');
      toast.success('Order cancelled');
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to cancel order');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Review live orders and move fulfillment through valid states only.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-background p-4 rounded-2xl border border-border/50 premium-shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by order number, customer, or email..." className="pl-9 bg-secondary/10 border-none rounded-xl h-10" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-10 gap-2 border-border/50" disabled>
            <Filter className="h-4 w-4" />
            Live data
          </Button>
          <select className="h-10 px-3 rounded-xl bg-background border border-border/50 text-sm" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="total">Sort by: Total amount</option>
          </select>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Fulfillment</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {ordersLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading orders...</td>
                </tr>
              )}
              {!ordersLoading && ordersError && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-red-600">{ordersError}</td>
                </tr>
              )}
              {!ordersLoading && !ordersError && filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4 font-bold">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="capitalize">{order.paymentStatus}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="capitalize">{order.fulfillmentStatus}</Badge>
                  </td>
                  <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
              {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l-0 sm:border-l border-border/50 p-0">
          {selectedOrder && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 border-b border-border/50 bg-secondary/10">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-2xl font-heading font-bold">{selectedOrder.orderNumber}</SheetTitle>
                    <p className="text-sm text-muted-foreground mt-1">{new Date(selectedOrder.date).toLocaleString()}</p>
                  </div>
                  <Badge className="capitalize">{selectedOrder.paymentStatus}</Badge>
                </div>
              </SheetHeader>

              <div className="p-6 space-y-8 flex-grow">
                <div className="space-y-2">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Customer</h3>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Shipping address</h3>
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                      {selectedOrder.shippingAddress.line1}<br />
                      {selectedOrder.shippingAddress.line2 ? <>{selectedOrder.shippingAddress.line2}<br /></> : null}
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Items</h3>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-16 w-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.color} / {item.size}</p>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>{item.quantity} x ${item.unitPrice.toFixed(2)}</span>
                          <span className="font-medium">${item.lineTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>${selectedOrder.shippingAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50 mt-2">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 bg-background sticky bottom-0 space-y-3">
                {NEXT_FULFILLMENT_STATUS[selectedOrder.fulfillmentStatus] && (
                  <Button className="w-full rounded-xl h-12 font-bold gap-2" onClick={() => handleStatusAdvance(selectedOrder)}>
                    {selectedOrder.fulfillmentStatus === 'processing' ? <Truck className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    Mark as {NEXT_FULFILLMENT_STATUS[selectedOrder.fulfillmentStatus]}
                  </Button>
                )}
                {selectedOrder.fulfillmentStatus !== 'cancelled' && selectedOrder.fulfillmentStatus !== 'delivered' && (
                  <Button variant="outline" className="w-full rounded-xl h-12 text-destructive gap-2" onClick={() => handleCancel(selectedOrder)}>
                    <XCircle className="h-4 w-4" />
                    Cancel order
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
