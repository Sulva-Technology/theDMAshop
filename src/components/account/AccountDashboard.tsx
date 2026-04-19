import { BadgeCheck, Mail, MapPin, Package, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

export default function AccountDashboard() {
  const location = useLocation();
  const { profile, orders, ordersLoading, ordersError } = useStore();
  const isOrdersView = location.pathname.startsWith('/account/orders');

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={isOrdersView ? 'Your Orders | theDMAshop' : 'Your Account | theDMAshop'}
        description="Manage your account, profile, and order history at theDMAshop."
        canonicalPath={isOrdersView ? '/account/orders' : '/account'}
        noindex
      />
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Customer Account</p>
            <h1 className="text-4xl font-heading font-bold tracking-tight">
              {isOrdersView ? 'Your Orders' : 'Your Account'}
            </h1>
            <p className="text-muted-foreground">
              Manage your profile and track every order placed with theDMAshop.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant={isOrdersView ? 'outline' : 'default'} className="rounded-full">
              <Link to="/account">Profile</Link>
            </Button>
            <Button asChild variant={isOrdersView ? 'default' : 'outline'} className="rounded-full">
              <Link to="/account/orders">Orders</Link>
            </Button>
          </div>
        </div>

        {isOrdersView ? (
          <div className="rounded-3xl border border-border/50 bg-background overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Order History</h2>
                <p className="text-sm text-muted-foreground">Real-time statuses from your completed checkouts.</p>
              </div>
              <span className="text-sm text-muted-foreground">{orders.length} total orders</span>
            </div>
            <div className="divide-y divide-border/50">
              {ordersLoading ? (
                <div className="p-8 text-muted-foreground">Loading orders...</div>
              ) : ordersError ? (
                <div className="p-8 text-muted-foreground">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-muted-foreground">No orders yet.</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold">{order.orderNumber}</h3>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {`${order.items.length} item${order.items.length === 1 ? '' : 's'} • ${order.customerEmail}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">${order.total.toFixed(2)}</span>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        {order.fulfillmentStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 rounded-3xl border border-border/50 bg-background p-8 space-y-8">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold">Profile Details</h2>
                  <p className="text-sm text-muted-foreground">Customer profile synced from Supabase auth.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-secondary/20 p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    Full name
                  </div>
                  <p className="font-semibold">{profile?.fullName ?? 'No name on file'}</p>
                </div>
                <div className="rounded-2xl bg-secondary/20 p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="font-semibold">{profile?.email ?? 'No email available'}</p>
                </div>
                <div className="rounded-2xl bg-secondary/20 p-5 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    Default address
                  </div>
                  <p className="font-semibold">
                    {profile?.defaultAddress
                      ? `${profile.defaultAddress.line1}, ${profile.defaultAddress.city}, ${profile.defaultAddress.state}`
                      : 'No default address saved yet'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/50 bg-background p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold">Quick Summary</h2>
                  <p className="text-sm text-muted-foreground">Your most important store activity at a glance.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-secondary/20 p-5">
                <p className="text-sm text-muted-foreground mb-2">Orders placed</p>
                <p className="text-3xl font-bold">{orders.length}</p>
              </div>
              <Button asChild className="w-full rounded-full">
                <Link to="/account/orders">View order history</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
