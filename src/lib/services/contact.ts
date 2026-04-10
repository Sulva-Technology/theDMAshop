import { hasSupabaseConfig, requireSupabase } from '@/lib/supabase';
import type { ContactMessageInput } from '@/lib/types';

export async function submitContactMessage(payload: ContactMessageInput) {
  if (!hasSupabaseConfig) {
    return payload;
  }

  const supabase = requireSupabase();
  const { error } = await supabase.from('contact_messages').insert({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    order_number: payload.orderNumber ?? null,
    message: payload.message,
  });

  if (error) {
    throw error;
  }

  return payload;
}
