import { createClient } from '@supabase/supabase-js';

// Specific project credentials for Alpha Electricals & Plumbing Ltd
// URL and Anon/Public Key as found in Supabase Project Settings > API
const supabaseUrl = 'https://mieyjseiypykozsfgazj.supabase.co';
const supabaseAnonKey = 'sb_publishable_IF5Z1vWWAbG5b5Syl-ytTQ_u5G43LtM';

/**
 * Supabase Client Initialization
 * Hardcoded for stability in the current environment to ensure 
 * images and data load successfully without local .env dependency.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabase && typeof window !== 'undefined') {
  console.warn(
    "⚠️ Supabase configuration missing! Connection to mieyjseiypykozsfgazj.supabase.co failed."
  );
}
