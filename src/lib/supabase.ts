import { createClient } from '@supabase/supabase-js';

// Project credentials for Alpha Electricals & Plumbing Ltd
const supabaseUrl = 'https://mieyjseiypykozsfgazj.supabase.co';

/**
 * Supabase Public Anon Key
 * Use this for client-side data fetching and image resolution.
 * DO NOT use your Service Role (Secret) key here as it is visible to users.
 */
const supabaseAnonKey = 'sb_publishable_IF5Z1vWWAbG5b5Syl-ytTQ_u5G43LtM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabase && typeof window !== 'undefined') {
  console.warn(
    "⚠️ Supabase configuration missing! Connection to mieyjseiypykozsfgazj.supabase.co failed."
  );
}
