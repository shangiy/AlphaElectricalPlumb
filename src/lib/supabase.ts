import { createClient } from '@supabase/supabase-js';

// Project credentials for Alpha Electricals & Plumbing Ltd
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieyjseiypykozsfgazj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_IF5Z1vWWAbG5b5Syl-ytTQ_u5G43LtM';

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Global resilience check: Ensures the app doesn't crash if configuration is missing.
 */
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      "⚠️ Supabase environment variables are missing! Using default values. Ensure these are set in your production dashboard to avoid connection failures."
    );
  }
}
