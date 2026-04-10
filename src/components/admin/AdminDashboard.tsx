import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Tag, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  TrendingUp, 
  Package, 
  DollarSign,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useStore } from '@/lib/store';

import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminAnalytics from './AdminAnalytics';
import AdminCMS from './AdminCMS';

// Mock Data
const REVENUE_DATA = [
  { name: 'Mon', total: 1200 },
  { name: 'Tue', total: 2100 },
  { name: 'Wed', total: 1800 },
  { name: 'Thu', total: 2400 },
  { name: 'Fri', total: 3200 },
  { name: 'Sat', total: 4100 },
  { name: 'Sun', total: 3800 },
];

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, setCurrentPage } = useStore();

  const NavItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: string }) => {
    const active = activeTab === id;
    return (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    );
  };

  const renderContent = () => {
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
      case 'dashboard':
      default:
        return <DashboardOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex font-sans">
      
      {/* Sidebar */}
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
            
            <div className="mt-8 mb-6 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Management</div>
            <NavItem icon={Package} label="Inventory" id="inventory" />
            <NavItem icon={Tag} label="Discounts" id="discounts" />
            <NavItem icon={BarChart3} label="Analytics" id="analytics" />
            <NavItem icon={Settings} label="Content (CMS)" id="cms" />
            
            <div className="mt-8 mb-6 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">System</div>
            <NavItem icon={Settings} label="Settings" id="settings" />
          </div>

          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold">{user?.name || 'Admin User'}</span>
                <span className="text-xs text-muted-foreground">{user?.role === 'ADMIN' ? 'Store Owner' : 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-background border-b border-border/50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search orders, products, or customers..." 
                className="pl-10 bg-secondary/20 border-none rounded-full h-10 focus-visible:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
            </Button>
            <Button className="rounded-full gap-2 hidden sm:flex" onClick={() => setActiveTab('products')}>
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {renderContent()}
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function DashboardOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { orders, products, customers } = useStore();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
  const totalCustomers = customers.length;
  
  // Get low stock products
  const lowStockProducts = products.filter(p => p.inventory > 0 && p.inventory <= 5);
  const outOfStockProducts = products.filter(p => p.inventory === 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2 bg-background border border-border/50 rounded-lg p-1">
          <Button variant="ghost" size="sm" className="rounded-md h-8 text-xs font-medium">Today</Button>
          <Button variant="secondary" size="sm" className="rounded-md h-8 text-xs font-medium bg-secondary text-foreground">7 Days</Button>
          <Button variant="ghost" size="sm" className="rounded-md h-8 text-xs font-medium">30 Days</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, trend: '+12.5%', icon: DollarSign, positive: true },
          { label: 'Active Orders', value: activeOrders.toString(), trend: '+5.2%', icon: ShoppingCart, positive: true },
          { label: 'Total Customers', value: totalCustomers.toString(), trend: '+18.1%', icon: Users, positive: true },
          { label: 'Conversion Rate', value: '3.24%', trend: '-1.1%', icon: TrendingUp, positive: false },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className={`border-none ${stat.positive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                {stat.trend}
              </Badge>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Revenue Snapshot</h2>
            <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-5 w-5 text-muted-foreground" /></Button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Inventory */}
        <div className="space-y-8">
          <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl">
                <Plus className="h-4 w-4 mr-2" /> Create Discount Code
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl" onClick={() => onNavigate('customers')}>
                <Users className="h-4 w-4 mr-2" /> Add Customer
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl" onClick={() => onNavigate('settings')}>
                <Settings className="h-4 w-4 mr-2" /> Store Settings
              </Button>
            </div>
          </div>

          <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
            <h2 className="text-lg font-bold mb-4">Inventory Alerts</h2>
            <div className="space-y-4">
              {outOfStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[120px] sm:max-w-[200px]">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">{p.category}</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-none shrink-0">Out of Stock</Badge>
                </div>
              ))}
              {outOfStockProducts.length > 0 && lowStockProducts.length > 0 && <Separator />}
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[120px] sm:max-w-[200px]">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">{p.category}</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="bg-yellow-500/10 text-yellow-600 border-none shrink-0">Low Stock ({p.inventory})</Badge>
                </div>
              ))}
              {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">All products are well stocked.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Button variant="link" className="text-primary font-medium" onClick={() => onNavigate('orders')}>View All</Button>
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
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`border-none ${
                      order.status === 'Delivered' ? 'bg-green-500/10 text-green-600' : 
                      order.status === 'Processing' ? 'bg-blue-500/10 text-blue-600' : 
                      order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">${order.total.toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
