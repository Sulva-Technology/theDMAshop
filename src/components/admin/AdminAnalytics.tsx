import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, DollarSign, Download, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--primary) / 0.7)', 'hsl(var(--primary) / 0.4)', 'hsl(var(--primary) / 0.2)'];

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const { orders, products } = useStore();

  const revenueTrend = useMemo(() => {
    const byDay = new Map<string, { date: string; revenue: number; orders: number }>();

    for (const order of orders) {
      const key = new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const existing = byDay.get(key) ?? { date: key, revenue: 0, orders: 0 };
      existing.revenue += order.total;
      existing.orders += 1;
      byDay.set(key, existing);
    }

    return [...byDay.values()].slice(-14);
  }, [orders]);

  const categorySales = useMemo(() => {
    const totals = new Map<string, number>();
    const categoryByProductId = new Map<string, string>(products.map((product) => [product.id, product.category]));

    for (const order of orders) {
      for (const item of order.items) {
        const category = categoryByProductId.get(item.productId) ?? 'Uncategorized';
        totals.set(category, (totals.get(category) ?? 0) + item.lineTotal);
      }
    }

    return [...totals.entries()].map(([name, value]) => ({ name, value }));
  }, [orders, products]);

  const topProducts = useMemo(() => {
    const totals = new Map<string, { name: string; sales: number; revenue: number }>();

    for (const order of orders) {
      for (const item of order.items) {
        const existing = totals.get(item.productId) ?? { name: item.name, sales: 0, revenue: 0 };
        existing.sales += item.quantity;
        existing.revenue += item.lineTotal;
        totals.set(item.productId, existing);
      }
    }

    return [...totals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  const paymentBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const order of orders) {
      counts.set(order.paymentStatus, (counts.get(order.paymentStatus) ?? 0) + 1);
    }
    return [...counts.entries()].map(([status, count]) => ({ status, count }));
  }, [orders]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const unitsSold = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 data-testid="admin-analytics-heading" className="text-3xl font-heading font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Live revenue, order, and product performance from your real store data.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="appearance-none h-10 pl-10 pr-8 rounded-full bg-background border border-border/50 text-sm font-medium"
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <Button variant="outline" className="rounded-full gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} />
        <KpiCard title="Total Orders" value={String(totalOrders)} icon={ShoppingCart} />
        <KpiCard title="Avg. Order Value" value={`$${averageOrderValue.toFixed(2)}`} icon={TrendingUp} />
        <KpiCard title="Units Sold" value={String(unitsSold)} icon={Package} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Revenue Trend</h2>
            <p className="text-sm text-muted-foreground">{dateRange} grouped by order date</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Sales by Category</h2>
            <p className="text-sm text-muted-foreground">Revenue share from order items</p>
          </div>
          <div className="h-[280px]">
            {categorySales.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No sales yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySales} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                    {categorySales.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categorySales.map((category, index) => (
              <div key={category.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-lg font-bold">Top Products</h2>
            <p className="text-sm text-muted-foreground">Best sellers by revenue</p>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No paid order items yet.</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={`${product.name}-${index}`} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                  <p className="font-semibold">${product.revenue.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-lg font-bold">Payment Status</h2>
            <p className="text-sm text-muted-foreground">Current order payment outcomes</p>
          </div>
          <div className="p-6 space-y-4">
            {paymentBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              paymentBreakdown.map((entry) => (
                <div key={entry.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{entry.status}</Badge>
                  </div>
                  <span className="font-semibold">{entry.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </motion.div>
  );
}
