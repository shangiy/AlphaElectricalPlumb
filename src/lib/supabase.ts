import { createClient } from '@supabase/supabase-js';

// Project credentials for Alpha Electricals & Plumbing Ltd
const supabaseUrl = 'https://mieyjseiypykozsfgazj.supabase.co';
const supabaseAnonKey = 'sb_publishable_IF5Z1vWWAbG5b5Syl-ytTQ_u5G43LtM';

/**
 * Supabase Client Initialization
 * Hardcoded for stability to ensure images and data load successfully.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabase && typeof window !== 'undefined') {
  console.warn(
    "⚠️ Supabase configuration missing! Connection to mieyjseiypykozsfgazj.supabase.co failed."
  );
}
