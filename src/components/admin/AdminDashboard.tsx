import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  BarChart3,
  DollarSign,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';

import AdminAnalytics from './AdminAnalytics';
import AdminCMS from './AdminCMS';
import AdminCustomers from './AdminCustomers';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setCurrentPage } = useStore();

  const activeTab = location.pathname.endsWith('/products')
    ? 'products'
    : location.pathname.endsWith('/orders')
      ? 'orders'
      : location.pathname.endsWith('/customers')
        ? 'customers'
        : location.pathname.endsWith('/content')
          ? 'cms'
          : location.pathname.endsWith('/analytics')
            ? 'analytics'
            : 'dashboard';

  const destinationForTab = (id: string) => (id === 'dashboard' ? '/admin' : `/admin/${id}`);

  const NavItem = ({ icon: Icon, label, id }: { icon: React.ComponentType<{ className?: string }>; label: string; id: string }) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => navigate(destinationForTab(id))}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border/50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-8 border-b border-border/50">
            <button onClick={() => setCurrentPage('home')} className="text-2xl font-heading font-bold text-primary tracking-tighter">
              theDMAshop
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <div className="mb-6 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Overview</div>
            <NavItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
            <NavItem icon={ShoppingBag} label="Products" id="products" />
            <NavItem icon={ShoppingCart} label="Orders" id="orders" />
            <NavItem icon={Users} label="Customers" id="customers" />
            <NavItem icon={BarChart3} label="Analytics" id="analytics" />
            <NavItem icon={Settings} label="Content" id="cms" />
          </div>

          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold">{user?.name || 'Admin'}</span>
                <span className="text-xs text-muted-foreground">{user?.role === 'ADMIN' ? 'Store Owner' : 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-background border-b border-border/50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders, products, or customers..." className="pl-10 bg-secondary/20 border-none rounded-full h-10" />
            </div>
          </div>

          <Button className="rounded-full gap-2 hidden sm:flex" onClick={() => navigate('/admin/products')}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">{renderContent(activeTab, navigate)}</main>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}

function renderContent(activeTab: string, navigate: ReturnType<typeof useNavigate>) {
  switch (activeTab) {
    case 'products':
      return <AdminProducts />;
    case 'orders':
      return <AdminOrders />;
    case 'customers':
      return <AdminCustomers />;
    case 'analytics':
      return <AdminAnalytics />;
    case 'cms':
      return <AdminCMS />;
    default:
      return <DashboardOverview onNavigate={(tab) => navigate(tab === 'dashboard' ? '/admin' : `/admin/${tab}`)} />;
  }
}

function DashboardOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { orders, products, customers } = useStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter((order) => order.fulfillmentStatus === 'processing' || order.fulfillmentStatus === 'shipped').length;
  const lowStockProducts = products.filter((product) => product.inventory > 0 && product.inventory <= 5);
  const outOfStockProducts = products.filter((product) => product.inventory === 0);

  const revenueData = useMemo(() => {
    const byDay = new Map<string, { name: string; total: number }>();

    for (const order of orders) {
      const key = new Date(order.date).toLocaleDateString(undefined, { weekday: 'short' });
      const existing = byDay.get(key) ?? { name: key, total: 0 };
      existing.total += order.total;
      byDay.set(key, existing);
    }

    return [...byDay.values()].slice(-7);
  }, [orders]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Live operational snapshot from orders, customers, and inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
          { label: 'Active Orders', value: String(activeOrders), icon: ShoppingCart },
          { label: 'Total Customers', value: String(customers.length), icon: Users },
          { label: 'Products', value: String(products.length), icon: Package },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Revenue Snapshot</h2>
            <Button variant="ghost" className="rounded-full" onClick={() => onNavigate('analytics')}>Open analytics</Button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl" onClick={() => onNavigate('products')}>
                <Plus className="h-4 w-4 mr-2" /> Add product
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl" onClick={() => onNavigate('orders')}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Review orders
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl" onClick={() => onNavigate('cms')}>
                <Settings className="h-4 w-4 mr-2" /> Update content
              </Button>
            </div>
          </div>

          <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
            <h2 className="text-lg font-bold mb-4">Inventory Alerts</h2>
            <div className="space-y-4">
              {outOfStockProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-none">Out</Badge>
                </div>
              ))}
              {outOfStockProducts.length > 0 && lowStockProducts.length > 0 && <Separator />}
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <Badge variant="outline">Low ({product.inventory})</Badge>
                </div>
              ))}
              {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">All tracked products are sufficiently stocked.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Button variant="link" className="text-primary font-medium" onClick={() => onNavigate('orders')}>View all</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="capitalize">{order.fulfillmentStatus}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">${order.total.toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
