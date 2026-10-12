
import { createClient } from '@supabase/supabase-js';

// Using your specific project credentials as fallbacks to guarantee immediate connectivity.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieyjseiypykozsfgazj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_IF5Z1vWWAbG5b5Syl-ytTQ_u5G43LtM';

/**
 * Supabase Client Initialization
 * Standardized for the entire application to use authenticated or public storage requests.
 */
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

if (!supabase && typeof window !== 'undefined') {
  console.warn(
    "⚠️ Supabase configuration missing! Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables."
  );
}
