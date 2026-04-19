import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

function mapStorageError(error: { message?: string; statusCode?: string | number }, action: 'upload' | 'delete') {
  const message = error.message?.toLowerCase() ?? '';

  if (message.includes('row-level security') || message.includes('not allowed')) {
    return `You do not have permission to ${action} images in this bucket. Sign in with an admin account and confirm the Supabase storage policies are applied.`;
  }

  if (message.includes('bucket') && (message.includes('not found') || message.includes('does not exist'))) {
    return 'The Supabase storage bucket is missing. Apply the latest migrations to create the public `product-media` bucket.';
  }

  if (action === 'upload') {
    return 'Image upload failed. Check Supabase storage bucket setup and try again.';
  }

  return 'Image removal failed. Check Supabase storage bucket setup and try again.';
}

export async function uploadImage(file: File, bucket = 'media'): Promise<string | null> {
  if (!supabase) {
    throw new Error('Supabase storage is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the app.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (uploadError) {
    throw new Error(mapStorageError(uploadError, 'upload'));
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteImage(url: string, bucket = 'media') {
  if (!supabase || url.startsWith('blob:')) {
    return;
  }

  const fileName = url.split('/').pop();
  if (!fileName) {
    return;
  }

  const { error } = await supabase.storage.from(bucket).remove([fileName]);
  if (error) {
    throw new Error(mapStorageError(error, 'delete'));
  }
}
