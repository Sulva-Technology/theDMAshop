import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';

import { SEED_CMS_CONTENT } from '../src/lib/seed-data';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

async function main() {
  const rows = Object.entries(SEED_CMS_CONTENT).map(([key, value]) => ({
    scope: 'storefront',
    key,
    value,
  }));

  const { error } = await supabase.from('cms_settings').upsert(rows, { onConflict: 'scope,key' });
  if (error) {
    throw error;
  }

  console.log(`Seeded ${rows.length} CMS rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
