import { EMPTY_CMS_CONTENT } from '@/lib/defaults';
import { requireSupabase } from '@/lib/supabase';
import type { CMSContent } from '@/lib/types';

const SETTINGS_KEY = 'storefront';
const REQUIRED_KEYS: Array<keyof CMSContent> = ['hero', 'aboutUs', 'footer', 'navigation', 'policies', 'contactUs', 'seo'];

export async function fetchCMSContent(): Promise<CMSContent> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('cms_settings').select('key, value').eq('scope', SETTINGS_KEY);
  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('CMS content has not been initialized yet. Run the CMS bootstrap flow before launching the storefront.');
  }

  const entries = Object.fromEntries(data.map((row: any) => [row.key, row.value]));
  const missingKeys = REQUIRED_KEYS.filter((key) => entries[key] == null);
  if (missingKeys.length > 0) {
    throw new Error(`CMS content is incomplete. Missing sections: ${missingKeys.join(', ')}.`);
  }

  return {
    hero: entries.hero ?? EMPTY_CMS_CONTENT.hero,
    aboutUs: entries.aboutUs ?? EMPTY_CMS_CONTENT.aboutUs,
    footer: entries.footer ?? EMPTY_CMS_CONTENT.footer,
    navigation: entries.navigation ?? EMPTY_CMS_CONTENT.navigation,
    policies: entries.policies ?? EMPTY_CMS_CONTENT.policies,
    contactUs: entries.contactUs ?? EMPTY_CMS_CONTENT.contactUs,
    seo: entries.seo ?? EMPTY_CMS_CONTENT.seo,
  };
}

export async function saveCMSContent(content: CMSContent): Promise<CMSContent> {
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
