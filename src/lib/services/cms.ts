import { SEED_CMS_CONTENT } from '@/lib/seed-data';
import { hasSupabaseConfig, requireSupabase } from '@/lib/supabase';
import type { CMSContent } from '@/lib/types';

const SETTINGS_KEY = 'storefront';

export async function fetchCMSContent(): Promise<CMSContent> {
  if (!hasSupabaseConfig) {
    return SEED_CMS_CONTENT;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.from('cms_settings').select('key, value').eq('scope', SETTINGS_KEY);
  if (error || !data || data.length === 0) {
    return SEED_CMS_CONTENT;
  }

  const entries = Object.fromEntries(data.map((row: any) => [row.key, row.value]));
  return {
    hero: entries.hero ?? SEED_CMS_CONTENT.hero,
    aboutUs: entries.aboutUs ?? SEED_CMS_CONTENT.aboutUs,
    footer: entries.footer ?? SEED_CMS_CONTENT.footer,
    navigation: entries.navigation ?? SEED_CMS_CONTENT.navigation,
    policies: entries.policies ?? SEED_CMS_CONTENT.policies,
    contactUs: entries.contactUs ?? SEED_CMS_CONTENT.contactUs,
    seo: entries.seo ?? SEED_CMS_CONTENT.seo,
  };
}

export async function saveCMSContent(content: CMSContent): Promise<CMSContent> {
  if (!hasSupabaseConfig) {
    return content;
  }

  const supabase = requireSupabase();
  const rows = Object.entries(content).map(([key, value]) => ({
    scope: SETTINGS_KEY,
    key,
    value,
  }));

  const { error } = await supabase.from('cms_settings').upsert(rows, {
    onConflict: 'scope,key',
  });

  if (error) {
    throw error;
  }

  return content;
}
