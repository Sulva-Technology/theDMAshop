import { SEED_CUSTOMERS } from '@/lib/seed-data';
import { hasSupabaseConfig, requireSupabase } from '@/lib/supabase';
import type { CustomerSummary } from '@/lib/types';

export async function fetchAdminCustomers(): Promise<CustomerSummary[]> {
  if (!hasSupabaseConfig) {
    return SEED_CUSTOMERS;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc('admin_customer_summaries');
  if (error) {
    throw error;
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.full_name ?? row.email,
    email: row.email,
    location: row.location ?? 'Unknown',
    orders: Number(row.orders ?? 0),
    spent: Number(row.spent ?? 0),
    status: row.status ?? 'New',
    lastActive: row.last_active ?? 'Unknown',
  }));
}
