import { createClient } from '@supabase/supabase-js';

// Project credentials for Alpha Electricals & Plumbing Ltd
// We prioritize environment variables for Vercel/Studio production parity
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieyjseiypykozsfgazj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_IF5Z1vWWAbG5b5Syl-ytTQ_u5G43LtM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabase && typeof window !== 'undefined') {
  console.warn(
    "⚠️ Supabase configuration missing! Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
  );
}
