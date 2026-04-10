import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Download,
  Tag,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { useStore } from '@/lib/store';

// Mock Data
const REVENUE_TREND = [
  { date: 'Apr 1', revenue: 3200, orders: 24 },
  { date: 'Apr 2', revenue: 4100, orders: 35 },
  { date: 'Apr 3', revenue: 3800, orders: 28 },
  { date: 'Apr 4', revenue: 5200, orders: 42 },
  { date: 'Apr 5', revenue: 4800, orders: 38 },
  { date: 'Apr 6', revenue: 6100, orders: 51 },
  { date: 'Apr 7', revenue: 5900, orders: 48 },
];

const CATEGORY_SALES = [
  { name: 'Outerwear', value: 45 },
  { name: 'Tops', value: 25 },
  { name: 'Bottoms', value: 20 },
  { name: 'Accessories', value: 10 },
];

const TOP_PRODUCTS = [
  { name: 'Premium Wool Blend Overcoat', sales: 124, revenue: '$34,720', trend: '+12%' },
  { name: 'Cashmere Crewneck Sweater', sales: 98, revenue: '$19,110', trend: '+8%' },
  { name: 'Structured Chino Pant', sales: 85, revenue: '$10,200', trend: '-2%' },
  { name: 'Summer Linen Button-Down', sales: 72, revenue: '$6,120', trend: '+24%' },
];

const COUPON_PERFORMANCE = [
  { code: 'WELCOME10', uses: 342, revenue: '$42,500', status: 'Active' },
  { code: 'SUMMER25', uses: 128, revenue: '$18,200', status: 'Active' },
  { code: 'FLASH50', uses: 89, revenue: '$8,900', status: 'Expired' },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--primary) / 0.7)', 'hsl(var(--primary) / 0.4)', 'hsl(var(--primary) / 0.2)'];

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const { orders } = useStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed insights into your store's performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select 
              className="appearance-none h-10 pl-10 pr-8 rounded-full bg-background border border-border/50 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary premium-shadow-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
              <option>Custom Range...</option>
            </select>
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <Button variant="outline" className="rounded-full bg-background border-border/50 premium-shadow-sm gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} trend="+14.2%" isPositive={true} icon={DollarSign} />
        <KpiCard title="Total Orders" value={totalOrders.toString()} trend="+8.1%" isPositive={true} icon={ShoppingCart} />
        <KpiCard title="Conversion Rate" value="3.8%" trend="-0.4%" isPositive={false} icon={TrendingUp} />
        <KpiCard title="Avg. Order Value" value={`$${(totalRevenue / totalOrders).toFixed(2)}`} trend="+2.3%" isPositive={true} icon={Users} />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold">Revenue & Orders</h2>
              <p className="text-sm text-muted-foreground">Performance over {dateRange.toLowerCase()}</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value}`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Sales by Category</h2>
            <p className="text-sm text-muted-foreground">Revenue distribution</p>
          </div>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SALES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_SALES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">100%</span>
              <span className="text-xs text-muted-foreground">Total Sales</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {CATEGORY_SALES.map((category, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-sm text-muted-foreground">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">Best-Selling Products</h2>
              <p className="text-sm text-muted-foreground">Top performers by volume</p>
            </div>
            <Button variant="link" className="text-primary font-medium">View Report</Button>
          </div>
          <div className="p-0 flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium text-right">Sales</th>
                  <th className="px-6 py-4 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {TOP_PRODUCTS.map((product, i) => (
                  <tr key={i} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-medium truncate max-w-[150px]">{product.name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>{product.sales}</span>
                        <span className={`text-xs ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {product.trend}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold">{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coupon Performance */}
        <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">Discount Performance</h2>
              <p className="text-sm text-muted-foreground">Coupon usage and generated revenue</p>
            </div>
            <Button variant="link" className="text-primary font-medium">Manage</Button>
          </div>
          <div className="p-0 flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
                <tr>
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Uses</th>
                  <th className="px-6 py-4 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {COUPON_PERFORMANCE.map((coupon, i) => (
                  <tr key={i} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-mono tracking-widest">{coupon.code}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${coupon.status === 'Active' ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <span className={`w-2 h-2 rounded-full ${coupon.status === 'Active' ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">{coupon.uses}</td>
                    <td className="px-6 py-4 text-right font-bold">{coupon.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, isPositive, icon: Icon }: { title: string, value: string, trend: string, isPositive: boolean, icon: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <Badge variant="outline" className={`border-none ${isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
          {trend}
        </Badge>
      </div>
      <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </motion.div>
  );
}
