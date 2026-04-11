import { hasSupabaseConfig, requireSupabase } from '@/lib/supabase';

export async function subscribeToNewsletter(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Enter a valid email address.');
  }

  if (!hasSupabaseConfig) {
    return { email: normalizedEmail };
  }

  const supabase = requireSupabase();
  const { error } = await supabase.from('newsletter_subscribers').upsert(
    {
      email: normalizedEmail,
      source: 'footer',
    },
    { onConflict: 'email' },
  );

  if (error) {
    throw error;
  }

  return { email: normalizedEmail };
}
