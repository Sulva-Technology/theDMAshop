import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminBootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
const adminBootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const adminBootstrapName = process.env.ADMIN_BOOTSTRAP_NAME ?? 'Store Admin';

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
}

if (!adminBootstrapEmail) {
  throw new Error('Missing ADMIN_BOOTSTRAP_EMAIL.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

async function ensureAdminProfile() {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('email', adminBootstrapEmail)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (profile) {
    return profile;
  }

  if (!adminBootstrapPassword) {
    throw new Error(
      `No profile exists for ${adminBootstrapEmail}. Set ADMIN_BOOTSTRAP_PASSWORD to create the first admin automatically, or sign up that user first and rerun this script.`,
    );
  }

  const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
    email: adminBootstrapEmail,
    password: adminBootstrapPassword,
    email_confirm: true,
    user_metadata: {
      full_name: adminBootstrapName,
    },
  });

  if (createError) {
    throw createError;
  }

  const user = createdUser.user;
  if (!user) {
    throw new Error(`Supabase did not return a user record for ${adminBootstrapEmail}.`);
  }

  const profilePayload = {
    id: user.id,
    email: user.email ?? adminBootstrapEmail,
    full_name: (user.user_metadata?.full_name as string | undefined) ?? adminBootstrapName,
    role: 'admin' as const,
  };

  const { error: upsertError } = await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
  if (upsertError) {
    throw upsertError;
  }

  return {
    id: profilePayload.id,
    email: profilePayload.email,
    role: profilePayload.role,
  };
}

async function main() {
  const profile = await ensureAdminProfile();
  const { error: updateError } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', profile.id);
  if (updateError) {
    throw updateError;
  }

  console.log(`Ensured ${adminBootstrapEmail} has admin access.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
