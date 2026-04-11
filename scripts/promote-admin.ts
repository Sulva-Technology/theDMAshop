import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminBootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
}

if (!adminBootstrapEmail) {
  throw new Error('Missing ADMIN_BOOTSTRAP_EMAIL.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

async function main() {
  const { data, error } = await supabase.from('profiles').select('id, email, role').eq('email', adminBootstrapEmail).maybeSingle();
  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`No profile exists for ${adminBootstrapEmail}. Sign up that user first, then rerun this script.`);
  }

  const { error: updateError } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', data.id);
  if (updateError) {
    throw updateError;
  }

  console.log(`Promoted ${adminBootstrapEmail} to admin.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
